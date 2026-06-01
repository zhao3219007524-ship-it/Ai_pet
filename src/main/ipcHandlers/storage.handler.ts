import { ipcMain, app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'pet-companion.db');
let db: Database.Database;

// 初始化数据库
function initializeDB() {
  try {
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS pets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        personality TEXT,
        modelUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        customAttributes TEXT
      );

      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId TEXT REFERENCES pets(id),
        role TEXT CHECK(role IN ('user', 'assistant')),
        content TEXT,
        emotion TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        actionExecuted TEXT
      );

      CREATE TABLE IF NOT EXISTS emotion_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId TEXT UNIQUE REFERENCES pets(id),
        emotionToActionJSON TEXT,
        adaptationTrend REAL DEFAULT 0,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversation_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId TEXT REFERENCES pets(id),
        summary TEXT,
        keyTopics TEXT,
        period TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

ipcMain.on('ready', initializeDB);

// Pet Management
ipcMain.handle('storage:savePet', async (event, pet) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO pets (id, name, personality, modelUrl, customAttributes)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      pet.id,
      pet.name,
      pet.personality,
      pet.modelUrl || '',
      JSON.stringify(pet.customAttributes || {})
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('storage:getPets', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM pets');
    const pets = stmt.all();
    return pets.map((pet: any) => ({
      ...pet,
      customAttributes: JSON.parse(pet.customAttributes || '{}'),
    }));
  } catch (error: any) {
    console.error('Failed to get pets:', error);
    return [];
  }
});

ipcMain.handle('storage:getPet', async (event, id: string) => {
  try {
    const stmt = db.prepare('SELECT * FROM pets WHERE id = ?');
    const pet = stmt.get(id) as any;
    if (pet) {
      pet.customAttributes = JSON.parse(pet.customAttributes || '{}');
    }
    return pet;
  } catch (error: any) {
    return null;
  }
});

ipcMain.handle('storage:deletePet', async (event, id: string) => {
  try {
    const stmt = db.prepare('DELETE FROM pets WHERE id = ?');
    stmt.run(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Chat History
ipcMain.handle('storage:saveChatHistory', async (event, petId: string, messages: any[]) => {
  try {
    const insertStmt = db.prepare(`
      INSERT INTO chat_history (petId, role, content, emotion, actionExecuted)
      VALUES (?, ?, ?, ?, ?)
    `);

    messages.forEach((msg) => {
      insertStmt.run(
        petId,
        msg.role,
        msg.content,
        msg.emotion || '',
        msg.actionExecuted || ''
      );
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('storage:getChatHistory', async (event, petId: string, limit = 50) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM chat_history WHERE petId = ? ORDER BY timestamp DESC LIMIT ?
    `);
    const messages = stmt.all(petId, limit) as any[];
    return messages.reverse();
  } catch (error: any) {
    return [];
  }
});

// Emotion Profile
ipcMain.handle('storage:saveEmotionProfile', async (event, profile) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO emotion_profiles (petId, emotionToActionJSON, adaptationTrend)
      VALUES (?, ?, ?)
    `);
    stmt.run(
      profile.petId,
      JSON.stringify(profile.emotionToActionMap),
      profile.adaptationTrend || 0
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('storage:getEmotionProfile', async (event, petId: string) => {
  try {
    const stmt = db.prepare('SELECT * FROM emotion_profiles WHERE petId = ?');
    const profile = stmt.get(petId) as any;
    if (profile) {
      profile.emotionToActionMap = JSON.parse(profile.emotionToActionJSON || '{}');
    }
    return profile || null;
  } catch (error: any) {
    return null;
  }
});

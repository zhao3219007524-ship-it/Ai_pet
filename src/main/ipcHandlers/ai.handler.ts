import { ipcMain } from 'electron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const API_URL = 'https://api.deepseek.com/chat/completions';

ipcMain.handle('ai:sendMessage', async (event, content: string, context?: string) => {
  try {
    if (!API_KEY) {
      throw new Error('API_KEY not configured. Please set DEEPSEEK_API_KEY environment variable.');
    }

    const systemPrompt = context || `你是一个友好的虚拟桌宠。
你应该：
1. 用温暖、亲切的语气回应用户
2. 保持对话的连贯性
3. 偶尔表现出个性和情感
4. 回答要简洁，不超过50字`;

    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    return { success: true, message: aiResponse };
  } catch (error: any) {
    console.error('AI request failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get AI response',
    };
  }
});

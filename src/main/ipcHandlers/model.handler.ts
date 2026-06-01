import { ipcMain } from 'electron';

const emotionKeywords: Record<string, string[]> = {
  happy: ['开心', '高兴', '太好了', '哈哈', '开心死了', '极好', '棒', '太棒了', '好棒', '真开心', '开心极了', '太开心'],
  sad: ['难过', '伤心', '哭', '悲伤', '郁闷', '失落', '泪丧', '心碎', '不开心', '难受', '心烦', '好难过'],
  angry: ['生气', '愤怒', '烦', '讨厌', '气死了', '怎么', '为什么', '太过分了', '真的吗', '不爽', '很烦', '烦死了'],
  surprised: ['惊讶', '吓一跳', '呀', '天哪', '真的吗', '不会吧', '竟然', '没想到', '居然', '意外', '啊', '呀'],
  neutral: [],
};

function analyzeEmotionSimple(text: string): { emotion: string; confidence: number } {
  let maxScore = 0;
  let detectedEmotion = 'neutral';

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    let score = 0;
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion;
    }
  }

  const confidence = Math.min(maxScore * 0.25, 0.95);
  return { emotion: detectedEmotion, confidence };
}

ipcMain.handle('model:analyzeEmotion', async (event, text: string) => {
  try {
    const result = analyzeEmotionSimple(text);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Emotion analysis failed:', error);
    return {
      success: false,
      error: error.message,
      data: { emotion: 'neutral', confidence: 0.5 },
    };
  }
});

ipcMain.handle('model:generateModel', async (event, imageUrl: string) => {
  try {
    return {
      success: true,
      data: {
        modelUrl: 'mock://pet-model-3d.gltf',
        textures: [],
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

import { Emotion } from '../types/emotion';

const emotionKeywords: Record<Emotion, string[]> = {
  happy: ['开心', '高兴', '太好了', '哈哈', '开心死了', '极好', '棒', '太棒了', '好棒', '真开心', '开心极了', '太开心'],
  sad: ['难过', '伤心', '哭', '悲伤', '郁闷', '失落', '泪丧', '心碎', '不开心', '难受', '心烦', '好难过'],
  angry: ['生气', '愤怒', '烦', '讨厌', '气死了', '怎么', '为什么', '太过分了', '真的吗', '不爽', '很烦', '烦死了'],
  surprised: ['惊讶', '吓一跳', '呀', '天哪', '真的吗', '不会吧', '竟然', '没想到', '居然', '意外', '啊', '呀'],
  neutral: [],
};

export class EmotionEngine {
  analyzeEmotion(text: string): { emotion: Emotion; confidence: number; keywords: string[] } {
    let maxScore = 0;
    let detectedEmotion: Emotion = 'neutral';
    const matchedKeywords: string[] = [];

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      let score = 0;
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      });

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as Emotion;
      }
    }

    const confidence = Math.min(maxScore * 0.25, 0.95);
    return { emotion: detectedEmotion, confidence, keywords: matchedKeywords };
  }

  transitionEmotion(
    currentEmotion: Emotion,
    targetEmotion: Emotion,
    recentHistory: any[]
  ): Emotion {
    if (currentEmotion === targetEmotion) return currentEmotion;

    const emotionCounts: Record<Emotion, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      neutral: 0,
    };

    recentHistory.slice(0, 5).forEach((event) => {
      emotionCounts[event.detectedEmotion]++;
    });

    const emotionDistance: Record<string, Record<string, number>> = {
      happy: { sad: 2, angry: 2, surprised: 1, neutral: 1 },
      sad: { happy: 2, angry: 2, surprised: 1, neutral: 1 },
      angry: { happy: 2, sad: 2, surprised: 1, neutral: 1 },
      surprised: { happy: 1, sad: 1, angry: 1, neutral: 1 },
      neutral: { happy: 1, sad: 1, angry: 1, surprised: 1 },
    };

    const distance = emotionDistance[currentEmotion][targetEmotion] || 1;
    if (distance > 1 && Math.random() > 0.7) {
      return 'neutral';
    }

    return targetEmotion;
  }
}

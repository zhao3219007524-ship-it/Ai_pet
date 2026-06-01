export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';

export interface EmotionEvent {
  timestamp: number;
  userInput: string;
  detectedEmotion: Emotion;
  emotionConfidence: number;
  actionExecuted: string;
  userSatisfaction?: number;
}

export interface EmotionProfile {
  petId: string;
  emotionToActionMap: Map<Emotion, ActionPreference>;
  recentEmotions: EmotionEvent[];
  adaptationTrend: number;
}

export interface ActionPreference {
  preferredActions: Array<{
    actionId: string;
    score: number;
    frequency: number;
  }>;
  adaptationTrend: number;
}

export const EmotionColors: Record<Emotion, string> = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF4500',
  surprised: '#FF69B4',
  neutral: '#808080',
};

import { create } from 'zustand';
import { Emotion, EmotionEvent } from '../types/emotion';
import { PredefinedActions } from '../types/action';

interface ActionScore {
  actionId: string;
  score: number;
  frequency: number;
}

interface EmotionActionMap {
  [emotion: string]: ActionScore[];
}

interface EmotionStoreState {
  petId: string | null;
  emotionMap: EmotionActionMap;
  recentEmotions: EmotionEvent[];
  adaptationTrend: number;
  
  loadEmotionProfile: (petId: string) => Promise<void>;
  recordEmotionEvent: (event: EmotionEvent) => void;
  updateActionPreference: (emotion: Emotion, actionId: string, satisfaction: number) => void;
  getPreferredAction: (emotion: Emotion) => string;
  saveEmotionProfile: () => Promise<void>;
}

export const useEmotionStore = create<EmotionStoreState>((set, get) => ({
  petId: null,
  emotionMap: {
    happy: [],
    sad: [],
    angry: [],
    surprised: [],
    neutral: [],
  },
  recentEmotions: [],
  adaptationTrend: 0,

  loadEmotionProfile: async (petId: string) => {
    try {
      const profile = await (window as any).api.getEmotionProfile(petId);
      if (profile) {
        set({
          petId,
          emotionMap: profile.emotionToActionMap || {},
          adaptationTrend: profile.adaptationTrend || 0,
        });
      } else {
        // Initialize default map
        const defaultMap: EmotionActionMap = {};
        PredefinedActions.forEach((action) => {
          const emotion = action.emotion;
          if (!defaultMap[emotion]) {
            defaultMap[emotion] = [];
          }
          defaultMap[emotion].push({
            actionId: action.id,
            score: 50,
            frequency: 0,
          });
        });
        set({
          petId,
          emotionMap: defaultMap,
        });
      }
    } catch (error) {
      console.error('Failed to load emotion profile:', error);
    }
  },

  recordEmotionEvent: (event: EmotionEvent) => {
    set((state) => ({
      recentEmotions: [event, ...state.recentEmotions].slice(0, 20),
    }));
  },

  updateActionPreference: (emotion: Emotion, actionId: string, satisfaction: number) => {
    set((state) => {
      const newMap = { ...state.emotionMap };
      if (!newMap[emotion]) {
        newMap[emotion] = [];
      }

      const actionIndex = newMap[emotion].findIndex((a) => a.actionId === actionId);
      if (actionIndex >= 0) {
        const action = newMap[emotion][actionIndex];
        const scoreAdjustment = (satisfaction - 3) * 5;
        action.score = Math.max(0, Math.min(100, action.score + scoreAdjustment));
        action.frequency += 1;
      }

      return { emotionMap: newMap };
    });
  },

  getPreferredAction: (emotion: Emotion) => {
    const state = get();
    const actions = state.emotionMap[emotion] || [];
    
    if (actions.length === 0) {
      return 'idle_breathe';
    }

    const totalScore = actions.reduce((sum, a) => sum + a.score, 0);
    let random = Math.random() * totalScore;
    
    for (const action of actions) {
      random -= action.score;
      if (random <= 0) {
        return action.actionId;
      }
    }

    return actions[0].actionId;
  },

  saveEmotionProfile: async () => {
    try {
      const state = get();
      if (state.petId) {
        await (window as any).api.saveEmotionProfile({
          petId: state.petId,
          emotionToActionMap: state.emotionMap,
          adaptationTrend: state.adaptationTrend,
        });
      }
    } catch (error) {
      console.error('Failed to save emotion profile:', error);
    }
  },
}));

import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  actionExecuted?: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  currentPetId: string | null;
  addMessage: (message: Message) => void;
  loadChatHistory: (petId: string) => Promise<void>;
  saveChatHistory: (petId: string, messages: Message[]) => Promise<void>;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentPetId: null,

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  loadChatHistory: async (petId: string) => {
    try {
      const messages = await (window as any).api.getChatHistory(petId, 50);
      set({
        messages,
        currentPetId: petId,
      });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  },

  saveChatHistory: async (petId: string, messages: Message[]) => {
    try {
      await (window as any).api.saveChatHistory(petId, messages);
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  },

  clearHistory: () => {
    set({ messages: [] });
  },
}));

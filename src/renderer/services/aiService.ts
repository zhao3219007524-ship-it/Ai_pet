import { Message } from '../stores/chatStore';
import { MemoryEngine } from '../engines/memoryEngine';

export class AIService {
  private memoryEngine: MemoryEngine;

  constructor() {
    this.memoryEngine = new MemoryEngine();
  }

  async sendMessage(userMessage: string, allMessages: Message[], petPersonality: string): Promise<string> {
    try {
      const context = this.memoryEngine.buildContextForAI(allMessages, petPersonality);
      const response = await (window as any).api.sendMessage(userMessage, context);

      if (response.success) {
        return response.message;
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      console.error('AI Service Error:', error);
      return '哦呀，我有点累了，待会再聊吧...';
    }
  }

  async analyzeEmotion(text: string): Promise<{ emotion: string; confidence: number }> {
    try {
      const response = await (window as any).api.analyzeEmotion(text);

      if (response.success) {
        return response.data;
      } else {
        return { emotion: 'neutral', confidence: 0.5 };
      }
    } catch (error) {
      console.error('Emotion analysis error:', error);
      return { emotion: 'neutral', confidence: 0.5 };
    }
  }
}

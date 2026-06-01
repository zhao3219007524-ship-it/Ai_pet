import { Message } from '../stores/chatStore';

export interface ConversationSummary {
  date: Date;
  summary: string;
  keyTopics: string[];
  keyMessages: Array<{
    user: string;
    assistant: string;
  }>;
}

export class MemoryEngine {
  private messageThreshold = 15;
  private summaries: ConversationSummary[] = [];

  shouldSummarize(messageCount: number): boolean {
    return messageCount > this.messageThreshold && messageCount % this.messageThreshold === 0;
  }

  async summarizeMessages(messages: Message[]): Promise<ConversationSummary> {
    const keyMessages = messages
      .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content.length > 20))
      .slice(-10)
      .reduce(
        (acc, msg) => {
          if (msg.role === 'user') {
            acc.push({ user: msg.content, assistant: '' });
          } else if (acc.length > 0) {
            acc[acc.length - 1].assistant = msg.content;
          }
          return acc;
        },
        [] as Array<{ user: string; assistant: string }>
      );

    const keyTopics = this.extractTopics(messages);
    const summary = `用户与桌宠进行了${messages.length}次对话。主要讨论了：${keyTopics.join('、')}。`;

    const conversationSummary: ConversationSummary = {
      date: new Date(),
      summary,
      keyTopics,
      keyMessages,
    };

    this.summaries.push(conversationSummary);
    return conversationSummary;
  }

  private extractTopics(messages: Message[]): string[] {
    const topics = new Set<string>();
    const commonTopics = ['工作', '学习', '感情', '朋友', '家人', '天气', '游戏', '电影', '音乐', '运动'];

    messages.forEach((msg) => {
      commonTopics.forEach((topic) => {
        if (msg.content.includes(topic)) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  buildContextForAI(messages: Message[], personality: string): string {
    const recentMessages = messages.slice(-5);
    const summary = this.summaries[this.summaries.length - 1];

    let context = `你是一个${personality}的虚拟桌宠。\n`;

    if (summary) {
      context += `最近的对话摘要：${summary.summary}\n`;
    }

    context += `最近的对话：\n`;
    recentMessages.forEach((msg) => {
      context += `${msg.role === 'user' ? '用户' : '你'}：${msg.content}\n`;
    });

    context += `\n回复要求：\n1. 保持性格一致\n2. 回复简洁（不超过50字）\n3. 表现出情感和个性`;

    return context;
  }
}

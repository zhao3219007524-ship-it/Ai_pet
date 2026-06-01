export interface Pet {
  id: string;
  name: string;
  personality: 'energetic' | 'tsundere' | 'gentle' | 'playful' | 'shy';
  modelUrl?: string;
  avatarUrl?: string;
  createdAt: Date;
  customAttributes?: Record<string, any>;
}

export type Personality = Pet['personality'];

export const PersonalityDescriptions: Record<Personality, string> = {
  energetic: '活泼好动，充满能量',
  tsundere: '傲娇毒舌，表里不一',
  gentle: '温柔体贴，细心倾听',
  playful: '顽皮可爱，爱捣乱',
  shy: '腼腆内向，容易害羞',
};

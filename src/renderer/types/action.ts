export interface AnimationKeyframe {
  time: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  facial: FacialState;
}

export interface FacialState {
  smile?: number;
  eyeOpen?: number;
  mouthOpen?: number;
  blushIntensity?: number;
  tearIntensity?: number;
  [key: string]: number | undefined;
}

export interface Action {
  id: string;
  name: string;
  emotion: string;
  duration: number;
  keyframes: AnimationKeyframe[];
  soundEffect?: string;
  loopable: boolean;
  priority?: number;
}

export const PredefinedActions: Action[] = [
  {
    id: 'idle_breathe',
    name: '静静呼吸',
    emotion: 'neutral',
    duration: 3,
    keyframes: [
      {
        time: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 1, smile: 0 },
      },
      {
        time: 1.5,
        position: [0, 0.1, 0],
        rotation: [0, 0, 0],
        scale: [1.05, 1.05, 1],
        facial: { eyeOpen: 1, smile: 0.1 },
      },
      {
        time: 3,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 1, smile: 0 },
      },
    ],
    loopable: true,
  },
  {
    id: 'jump_happy',
    name: '开心蹦跳',
    emotion: 'happy',
    duration: 1.5,
    keyframes: [
      {
        time: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { smile: 0, eyeOpen: 1 },
      },
      {
        time: 0.5,
        position: [0, 2, 0],
        rotation: [0.1, 0, 0.1],
        scale: [1, 1, 1],
        facial: { smile: 1, eyeOpen: 1 },
      },
      {
        time: 1.5,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { smile: 0.5, eyeOpen: 1 },
      },
    ],
    loopable: false,
    priority: 3,
  },
  {
    id: 'sit_sad',
    name: '伤心蜷缩',
    emotion: 'sad',
    duration: 2,
    keyframes: [
      {
        time: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { smile: 0, eyeOpen: 0.5 },
      },
      {
        time: 1,
        position: [0, -0.5, 0],
        rotation: [0.3, 0, 0],
        scale: [0.9, 0.9, 1],
        facial: { smile: -0.2, eyeOpen: 0.3, tearIntensity: 0.5 },
      },
      {
        time: 2,
        position: [0, -0.5, 0],
        rotation: [0.3, 0, 0],
        scale: [0.9, 0.9, 1],
        facial: { smile: -0.2, eyeOpen: 0.3, tearIntensity: 0.3 },
      },
    ],
    loopable: true,
  },
  {
    id: 'wiggle_surprised',
    name: '惊讶摇摇',
    emotion: 'surprised',
    duration: 1.2,
    keyframes: [
      {
        time: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 1, mouthOpen: 0 },
      },
      {
        time: 0.3,
        position: [-0.3, 0, 0],
        rotation: [0, 0.2, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 1, mouthOpen: 0.8 },
      },
      {
        time: 0.6,
        position: [0.3, 0, 0],
        rotation: [0, -0.2, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 1, mouthOpen: 0.8 },
      },
      {
        time: 1.2,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { eyeOpen: 0.8, mouthOpen: 0.3 },
      },
    ],
    loopable: false,
  },
  {
    id: 'stomp_angry',
    name: '生气跺脚',
    emotion: 'angry',
    duration: 1.5,
    keyframes: [
      {
        time: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { smile: -0.5, eyeOpen: 1 },
      },
      {
        time: 0.5,
        position: [0, -0.3, 0],
        rotation: [0.1, 0, 0.05],
        scale: [1.1, 0.9, 1],
        facial: { smile: -0.8, eyeOpen: 1, blushIntensity: 0.8 },
      },
      {
        time: 1.5,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        facial: { smile: -0.3, eyeOpen: 0.8 },
      },
    ],
    loopable: false,
  },
];

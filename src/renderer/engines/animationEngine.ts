import { Action, AnimationKeyframe, FacialState } from '../types/action';

export interface AnimationState {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  facial: FacialState;
}

export class AnimationEngine {
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private currentAction: Action | null = null;
  private onStateUpdate: ((state: AnimationState) => void) | null = null;
  private animationFrameId: number | null = null;

  playAction(action: Action, callback?: (state: AnimationState) => void) {
    this.currentAction = action;
    this.onStateUpdate = callback || null;
    this.currentTime = 0;
    this.isPlaying = true;
    this.animate();
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animate = () => {
    if (!this.isPlaying || !this.currentAction) return;

    this.currentTime += 1 / 60;

    if (this.currentTime > this.currentAction.duration) {
      if (this.currentAction.loopable) {
        this.currentTime = 0;
      } else {
        this.isPlaying = false;
        return;
      }
    }

    const state = this.interpolateKeyframes(this.currentAction.keyframes, this.currentTime);
    if (this.onStateUpdate) {
      this.onStateUpdate(state);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private interpolateKeyframes(keyframes: AnimationKeyframe[], time: number): AnimationState {
    let prevFrame = keyframes[0];
    let nextFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (keyframes[i].time <= time && time <= keyframes[i + 1].time) {
        prevFrame = keyframes[i];
        nextFrame = keyframes[i + 1];
        break;
      }
    }

    const duration = nextFrame.time - prevFrame.time;
    const t = duration === 0 ? 0 : (time - prevFrame.time) / duration;

    return {
      position: this.lerpVec3(prevFrame.position, nextFrame.position, t),
      rotation: this.lerpVec3(prevFrame.rotation, nextFrame.rotation, t),
      scale: this.lerpVec3(prevFrame.scale, nextFrame.scale, t),
      facial: this.blendFacialStates(prevFrame.facial, nextFrame.facial, t),
    };
  }

  private lerpVec3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  private blendFacialStates(a: FacialState, b: FacialState, t: number): FacialState {
    const result: FacialState = {};
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

    allKeys.forEach((key) => {
      const aVal = a[key] || 0;
      const bVal = b[key] || 0;
      result[key] = aVal + (bVal - aVal) * t;
    });

    return result;
  }
}

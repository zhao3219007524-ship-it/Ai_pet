import React, { useEffect, useRef, useState } from 'react';
import { AnimationEngine, AnimationState } from '../engines/animationEngine';
import { PredefinedActions } from '../types/action';
import '../styles/PetDisplay.css';

interface PetDisplayProps {
  actionId: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ actionId }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [animationEngine] = useState(new AnimationEngine());
  const [animationState, setAnimationState] = useState<AnimationState>({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    facial: {},
  });

  useEffect(() => {
    const action = PredefinedActions.find((a) => a.id === actionId) || PredefinedActions[0];
    animationEngine.playAction(action, (state) => {
      setAnimationState(state);
    });

    return () => {
      animationEngine.stop();
    };
  }, [actionId, animationEngine]);

  const transform = `
    translate3d(
      ${animationState.position[0] * 20}px,
      ${animationState.position[1] * 20}px,
      ${animationState.position[2] * 20}px
    )
    rotateX(${animationState.rotation[0]}rad)
    rotateY(${animationState.rotation[1]}rad)
    rotateZ(${animationState.rotation[2]}rad)
    scale(${animationState.scale[0]}, ${animationState.scale[1]})
  `;

  const faceOpacity = animationState.facial.eyeOpen !== undefined ? animationState.facial.eyeOpen : 1;
  const smile = animationState.facial.smile || 0;
  const mouthOpen = animationState.facial.mouthOpen || 0;
  const tearIntensity = animationState.facial.tearIntensity || 0;
  const blushIntensity = animationState.facial.blushIntensity || 0;

  return (
    <div className="pet-display" ref={canvasRef}>
      <div className="pet-body" style={{ transform }}>
        <div className="body-main" />
        <div className="head">
          <div className="eyes">
            <div className="eye left" style={{
              opacity: faceOpacity,
              transform: `scaleY(${1 - faceOpacity * 0.3})`,
            }}>
              <div className="pupil" />
            </div>
            <div className="eye right" style={{
              opacity: faceOpacity,
              transform: `scaleY(${1 - faceOpacity * 0.3})`,
            }}>
              <div className="pupil" />
            </div>
          </div>
          <div className="mouth">
            {smile > 0 && (
              <div className="smile" style={{
                borderRadius: `100% 100% 0 0 / ${smile * 100}% ${smile * 100}% 0 0`,
                opacity: smile,
              }} />
            )}
            {smile < 0 && (
              <div className="frown" style={{
                borderRadius: `0 0 100% 100% / 0 0 ${-smile * 100}% ${-smile * 100}%`,
                opacity: -smile,
              }} />
            )}
            {mouthOpen > 0 && (
              <div className="mouth-open" style={{
                height: `${mouthOpen * 20}px`,
              }} />
            )}
          </div>
          {blushIntensity > 0 && (
            <>
              <div className="blush left" style={{ opacity: blushIntensity }} />
              <div className="blush right" style={{ opacity: blushIntensity }} />
            </>
          )}
          {tearIntensity > 0 && (
            <>
              <div className="tear left" style={{
                opacity: tearIntensity,
                animation: `tear-fall 1s ease-in forwards`,
              }} />
              <div className="tear right" style={{
                opacity: tearIntensity,
                animation: `tear-fall 1s ease-in forwards`,
              }} />
            </>
          )}
        </div>
        <div className="arms" style={{
          transform: `rotateZ(${animationState.rotation[0] * 30}deg)`,
        }}>
          <div className="arm left" />
          <div className="arm right" />
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;

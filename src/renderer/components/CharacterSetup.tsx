import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePetStore } from '../stores/petStore';
import { PersonalityDescriptions } from '../types/pet';
import '../styles/CharacterSetup.css';

interface CharacterSetupProps {
  onComplete: () => void;
}

const CharacterSetup: React.FC<CharacterSetupProps> = ({ onComplete }) => {
  const { createPet } = usePetStore();
  const [petName, setPetName] = useState('');
  const [personality, setPersonality] = useState<'energetic' | 'tsundere' | 'gentle' | 'playful' | 'shy'>('energetic');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!petName.trim()) {
      alert('请输入宠物名字');
      return;
    }

    setIsCreating(true);

    try {
      const newPet = {
        id: uuidv4(),
        name: petName,
        personality,
        createdAt: new Date(),
        customAttributes: {},
      };

      await createPet(newPet);
      onComplete();
    } catch (error) {
      console.error('Failed to create pet:', error);
      alert('创建宠物失败');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="character-setup">
      <div className="setup-container">
        <h1>✨ 创建你的虚拟桌宠 ✨</h1>

        <div className="form-group">
          <label>宠物名字</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="给你的桌宠起个名字吧~"
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label>性格选择</label>
          <div className="personality-options">
            {Object.entries(PersonalityDescriptions).map(([key, desc]) => (
              <div
                key={key}
                className={`personality-card ${personality === key ? 'active' : ''}`}
                onClick={() => setPersonality(key as any)}
              >
                <div className="personality-name">{key}</div>
                <div className="personality-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating || !petName.trim()}
          className="btn-create"
        >
          {isCreating ? '创建中...' : '创建宠物'}
        </button>
      </div>
    </div>
  );
};

export default CharacterSetup;

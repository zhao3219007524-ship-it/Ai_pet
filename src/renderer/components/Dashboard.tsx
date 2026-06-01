import React, { useState, useEffect } from 'react';
import { usePetStore } from '../stores/petStore';
import { useChatStore, Message } from '../stores/chatStore';
import { useEmotionStore } from '../stores/emotionStore';
import PetDisplay from './PetDisplay';
import ChatBox from './ChatBox';
import { AIService } from '../services/aiService';
import { EmotionEngine } from '../engines/emotionEngine';
import { PredefinedActions } from '../types/action';
import '../styles/Dashboard.css';

interface DashboardProps {
  onNewPet: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewPet }) => {
  const { currentPet } = usePetStore();
  const { messages, addMessage, loadChatHistory, saveChatHistory } = useChatStore();
  const {
    getPreferredAction,
    recordEmotionEvent,
    updateActionPreference,
    loadEmotionProfile,
    saveEmotionProfile,
  } = useEmotionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('idle_breathe');

  const aiService = new AIService();
  const emotionEngine = new EmotionEngine();

  useEffect(() => {
    if (currentPet) {
      loadChatHistory(currentPet.id);
      loadEmotionProfile(currentPet.id);
    }
  }, [currentPet]);

  const handleSendMessage = async (userInput: string) => {
    if (!currentPet) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const { emotion, confidence } = await aiService.analyzeEmotion(userInput);
      const actionId = getPreferredAction(emotion as any);
      const action = PredefinedActions.find((a) => a.id === actionId) || PredefinedActions[0];

      setCurrentAction(actionId);

      recordEmotionEvent({
        timestamp: Date.now(),
        userInput,
        detectedEmotion: emotion as any,
        emotionConfidence: confidence,
        actionExecuted: actionId,
      });

      const aiResponse = await aiService.sendMessage(userInput, messages, currentPet.personality);

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse,
        emotion,
        actionExecuted: actionId,
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);
      await saveChatHistory(currentPet.id, [...messages, userMessage, assistantMessage]);
      await saveEmotionProfile();

      setTimeout(() => {
        setCurrentAction('idle_breathe');
      }, action.duration * 1000);
    } catch (error) {
      console.error('Error handling message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="pet-section">
        <PetDisplay actionId={currentAction} />
      </div>

      <div className="chat-section">
        <ChatBox messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      <div className="footer">
        <button onClick={onNewPet} className="btn-new-pet">
          + 新建宠物
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

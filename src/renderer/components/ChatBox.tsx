import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../stores/chatStore';
import '../styles/ChatBox.css';

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-content">
              {message.content}
              {message.emotion && <span className="message-emotion"> ({message.emotion})</span>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="和桌宠聊天..."
          disabled={isLoading}
          className="message-input"
        />
        <button type="submit" disabled={isLoading} className="send-button">
          {isLoading ? '思考中...' : '发送'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;

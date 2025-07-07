'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (prompt: string, useSplitMode: boolean) => void;
}

export default function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [splitMode, setSplitMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    onSendMessage(prompt, splitMode);
    setPrompt('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[700px] flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chat Console</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Split Mode</span>
            <button
              onClick={() => setSplitMode(!splitMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                splitMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  splitMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        {splitMode && (
          <p className="text-sm text-blue-600 mt-2">
            <i className="ri-information-line mr-1"></i>
            Split mode will send your prompt to two different AI models simultaneously
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-chat-3-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Send a message to begin chatting with AI models</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'assistant' && message.model && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {message.model}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </div>
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex items-center space-x-2 px-6"
          >
            <i className="ri-send-plane-line"></i>
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
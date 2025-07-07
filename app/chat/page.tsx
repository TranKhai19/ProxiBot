'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import ChatInterface from './ChatInterface';
import ResultsPanel from './ResultsPanel';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (prompt: string, useSplitMode: boolean) => {
    setIsLoading(true);
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI responses
    setTimeout(() => {
      if (useSplitMode) {
        const model1Response = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Model 1 Response: This is the first model\'s interpretation of your request. It focuses on practical implementation and step-by-step guidance.',
          model: 'GPT-4',
          timestamp: new Date()
        };
        
        const model2Response = {
          id: Date.now() + 2,
          type: 'assistant',
          content: 'Model 2 Response: Here\'s an alternative perspective from the second model, emphasizing creative solutions and broader context analysis.',
          model: 'Claude',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, model1Response, model2Response]);
      } else {
        const response = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Here\'s a comprehensive response to your query. The system has processed your request using the configured AI models and proxy settings.',
          model: 'GPT-4',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, response]);
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat Interface</h1>
            <p className="text-gray-600">Interact with multiple AI models using your configured proxies and API keys</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ResultsPanel messages={messages} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
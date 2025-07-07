'use client';

import { useState, useMemo } from 'react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
}

interface ResultsPanelProps {
  messages: Message[];
}

export default function ResultsPanel({ messages }: ResultsPanelProps) {
  const [selectedTab, setSelectedTab] = useState('summary');

  const assistantMessages = useMemo(() => 
    messages.filter(m => m.type === 'assistant'), 
    [messages]
  );

  const stats = useMemo(() => ({
    totalMessages: messages.length,
    aiResponses: assistantMessages.length,
    modelsUsed: [...new Set(assistantMessages.map(m => m.model).filter(Boolean))],
    avgResponseTime: '1.2s'
  }), [messages, assistantMessages]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[700px] flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Results & Analytics</h2>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('summary')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setSelectedTab('models')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedTab === 'models'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Models
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedTab === 'summary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <i className="ri-chat-3-line text-blue-600"></i>
                  <span className="text-sm font-medium text-blue-900">Messages</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <i className="ri-robot-line text-green-600"></i>
                  <span className="text-sm font-medium text-green-900">AI Responses</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.aiResponses}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <i className="ri-time-line mr-2"></i>
                Performance Metrics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="font-medium">{stats.avgResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Models Active:</span>
                  <span className="font-medium">{stats.modelsUsed.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <i className="ri-history-line mr-2"></i>
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {messages.slice(-3).map((message) => (
                    <div key={message.id} className="text-sm">
                      <div className="flex items-center space-x-2">
                        <i className={`${
                          message.type === 'user' ? 'ri-user-line text-blue-500' : 'ri-robot-line text-green-500'
                        }`}></i>
                        <span className="text-gray-600">
                          {message.type === 'user' ? 'User' : message.model || 'AI'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'models' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <i className="ri-cpu-line mr-2"></i>
                Active AI Models
              </h3>
              
              {stats.modelsUsed.length > 0 ? (
                <div className="space-y-3">
                  {stats.modelsUsed.map((model) => (
                    <div key={model} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">{model}</div>
                          <div className="text-sm text-gray-500">Active</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {assistantMessages.filter(m => m.model === model).length} responses
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="ri-robot-line text-3xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">No models used yet</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <i className="ri-settings-3-line mr-2"></i>
                Configuration Status
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Proxies Configured:</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">3 Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Keys:</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">2 Valid</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connection:</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-600">Stable</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
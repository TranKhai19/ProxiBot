'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed: string;
  usageCount: number;
}

export default function ApiKeyList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      service: 'OpenAI',
      key: 'sk-proj-***************************',
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '5 minutes ago',
      usageCount: 1247
    },
    {
      id: '2',
      name: 'Claude API',
      service: 'Anthropic',
      key: 'sk-ant-***************************',
      status: 'active',
      createdAt: '2024-01-10',
      lastUsed: '2 hours ago',
      usageCount: 892
    },
    {
      id: '3',
      name: 'Gemini Pro',
      service: 'Google',
      key: 'AIza***************************',
      status: 'inactive',
      createdAt: '2024-01-05',
      lastUsed: '3 days ago',
      usageCount: 423
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-yellow-700 bg-yellow-100';
      case 'expired': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'openai': return 'ri-openai-line';
      case 'anthropic': return 'ri-robot-line';
      case 'google': return 'ri-google-line';
      default: return 'ri-key-line';
    }
  };

  const testApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id 
        ? { ...key, status: 'active' as const, lastUsed: 'Just now' }
        : key
    ));
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  return (
    <div className="space-y-4">
      {apiKeys.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-key-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys configured</h3>
          <p className="text-gray-500">Add your first API key to get started</p>
        </div>
      ) : (
        apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <i className={`${getServiceIcon(apiKey.service)} text-lg`}></i>
                    <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apiKey.status)}`}>
                    {apiKey.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <i className="ri-shield-keyhole-line"></i>
                      <span className="font-mono">{apiKey.key}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="ri-bar-chart-line"></i>
                      <span>{apiKey.usageCount.toLocaleString()} uses</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <i className="ri-calendar-line"></i>
                      <span>Created: {apiKey.createdAt}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="ri-time-line"></i>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => testApiKey(apiKey.id)}
                  className="flex items-center space-x-1"
                >
                  <i className="ri-refresh-line"></i>
                  <span>Test</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <i className="ri-edit-line"></i>
                  <span>Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="flex items-center space-x-1"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
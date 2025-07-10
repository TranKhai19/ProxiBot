'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import EditApiKeyModal from './EditApiKeyModal';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  apiKey: string;
  endpoint: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed: string;
  usageCount: number;
}

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export default function ApiKeyList({ apiKeys, setApiKeys }: ApiKeyListProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    console.log('ApiKeyList mounted');
    return () => console.log('ApiKeyList unmounted');
  }, []);

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

  const testApiKey = async (id: string) => {
    const apiKey = apiKeys.find(k => k.id === id);
    if (!apiKey) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      let url = '';
      let headers: HeadersInit = {};
      let body: string | undefined;

      switch (apiKey.service.toLowerCase()) {
        case 'openai':
          url = 'https://api.openai.com/v1/models';
          headers = { Authorization: `Bearer ${apiKey.apiKey}` };
          break;
        case 'anthropic':
          url = 'https://api.anthropic.com/v1/messages';
          headers = {
            'x-api-key': apiKey.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          };
          body = JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Test' }],
          });
          break;
        case 'google':
          url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey.apiKey;
          headers = { 'Content-Type': 'application/json' };
          break;
        case 'custom':
          if (!apiKey.endpoint) throw new Error('Custom service requires an endpoint.');
          url = apiKey.endpoint;
          headers = { Authorization: `Bearer ${apiKey.apiKey}` };
          break;
        default:
          throw new Error('Unsupported service provider.');
      }

      const response = await fetch(url, {
        method: apiKey.service.toLowerCase() === 'anthropic' ? 'POST' : 'GET',
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setApiKeys(prev =>
          prev.map(k =>
            k.id === id
              ? {
                  ...k,
                  status: 'active' as const,
                  lastUsed: new Date().toISOString(),
                  usageCount: k.usageCount + 1,
                }
              : k
          )
        );
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed');
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error(`Error testing API key ${apiKey.name}:`, error);
      setApiKeys(prev =>
        prev.map(k =>
          k.id === id
            ? {
                ...k,
                status: 'expired' as const,
                lastUsed: new Date().toISOString(),
              }
            : k
        )
      );
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Unknown error';
      alert(`Failed to test API key ${apiKey.name}: ${errorMessage}`);
    } finally {
      setApiKeys(prev => {
        if (prev.length > 0) {
          localStorage.setItem('apiKeys', JSON.stringify(prev));
        } else {
          localStorage.removeItem('apiKeys');
        }
        return prev;
      });
    }
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => {
      const newApiKeys = prev.filter(key => key.id !== id);
      if (newApiKeys.length > 0) {
        localStorage.setItem('apiKeys', JSON.stringify(newApiKeys));
      } else {
        localStorage.removeItem('apiKeys');
      }
      return newApiKeys;
    });
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const deleteSelectedApiKeys = () => {
    if (selectedIds.length === 0) {
      alert('No API keys selected for deletion.');
      return;
    }
    setApiKeys(prev => {
      const newApiKeys = prev.filter(key => !selectedIds.includes(key.id));
      if (newApiKeys.length > 0) {
        localStorage.setItem('apiKeys', JSON.stringify(newApiKeys));
      } else {
        localStorage.removeItem('apiKeys');
      }
      return newApiKeys;
    });
    setSelectedIds([]);
  };

  const editApiKey = (updatedApiKey: ApiKey) => {
    const isDuplicate = apiKeys.some(
      k => k.id !== updatedApiKey.id && k.apiKey === updatedApiKey.apiKey
    );

    if (isDuplicate) {
      alert(`An API key with value ${updatedApiKey.apiKey} already exists.`);
      return;
    }

    setApiKeys(prev => {
      const newApiKeys = prev.map(k =>
        k.id === updatedApiKey.id ? updatedApiKey : k
      );
      localStorage.setItem('apiKeys', JSON.stringify(newApiKeys));
      return newApiKeys;
    });
  };

  const openEditModal = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsEditModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === apiKeys.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(apiKeys.map(key => key.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {apiKeys.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-key-line text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys configured</h3>
          <p className="text-gray-500">Add your first API key to get started</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIds.length === apiKeys.length && apiKeys.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({selectedIds.length} selected)
              </span>
            </div>
            <Button
              size="sm"
              variant="danger"
              onClick={deleteSelectedApiKeys}
              disabled={selectedIds.length === 0}
              className="flex items-center space-x-1"
            >
              <i className="ri-delete-bin-line" />
              <span>Delete Selected</span>
            </Button>
          </div>
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(apiKey.id)}
                    onChange={() => toggleSelect(apiKey.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <i className={`${getServiceIcon(apiKey.service)} text-lg`} />
                        <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apiKey.status)}`}>
                        {apiKey.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <i className="ri-shield-keyhole-line" />
                          <span className="font-mono">{apiKey.apiKey}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-bar-chart-line" />
                          <span>{apiKey.usageCount.toLocaleString()} uses</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <i className="ri-calendar-line" />
                          <span>Created: {apiKey.createdAt}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-time-line" />
                          <span>Last used: {apiKey.lastUsed}</span>
                        </span>
                      </div>
                      {apiKey.endpoint && (
                        <div className="flex items-center space-x-1">
                          <i className="ri-link" />
                          <span>Endpoint: {apiKey.endpoint}</span>
                        </div>
                      )}
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
                    <i className="ri-refresh-line" />
                    <span>Test</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(apiKey)}
                    className="flex items-center space-x-1"
                  >
                    <i className="ri-edit-line" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="flex items-center space-x-1"
                  >
                    <i className="ri-delete-bin-line" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <EditApiKeyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={editApiKey}
        apiKey={selectedApiKey}
      />
    </div>
  );
}

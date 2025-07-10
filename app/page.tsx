'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ProxyList from './ProxyList';
import ApiKeyList from './ApiKeyList';
import AddProxyModal from './AddProxyModal';
import AddApiKeyModal from './AddApiKeyModal';

interface Proxy {
  id: string;
  name: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked: string;
  location: string;
}

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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('proxies');
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const MAX_PROXIES = 1000;
  const MAX_API_KEYS = 100;

  // Load proxies and API keys from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Load proxies
      const savedProxies = localStorage.getItem('proxies');
      if (savedProxies) {
        const parsedProxies: Proxy[] = JSON.parse(savedProxies);
        if (
          Array.isArray(parsedProxies) &&
          parsedProxies.every(p => p.id && p.name && p.host && p.port && p.type && p.status && p.lastChecked && p.location)
        ) {
          setProxies(parsedProxies.slice(0, MAX_PROXIES));
        }
      }

      // Load API keys
      const savedApiKeys = localStorage.getItem('apiKeys');
      if (savedApiKeys) {
        const parsedApiKeys: ApiKey[] = JSON.parse(savedApiKeys);
        if (
          Array.isArray(parsedApiKeys) &&
          parsedApiKeys.every(k => k.id && k.name && k.service && k.apiKey && k.status && k.createdAt && k.lastUsed && typeof k.usageCount === 'number')
        ) {
          setApiKeys(parsedApiKeys.slice(0, MAX_API_KEYS));
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      alert('Failed to load data from storage. Clearing invalid data.');
      localStorage.removeItem('proxies');
      localStorage.removeItem('apiKeys');
    }
  }, []);

  // Save proxies and API keys to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Save proxies
      if (proxies.length > MAX_PROXIES) {
        alert(`Cannot save more than ${MAX_PROXIES} proxies due to storage limits.`);
        setProxies(proxies.slice(0, MAX_PROXIES));
        return;
      }
      if (proxies.length > 0) {
        localStorage.setItem('proxies', JSON.stringify(proxies));
      } else {
        localStorage.removeItem('proxies');
      }

      // Save API keys
      if (apiKeys.length > MAX_API_KEYS) {
        alert(`Cannot save more than ${MAX_API_KEYS} API keys due to storage limits.`);
        setApiKeys(apiKeys.slice(0, MAX_API_KEYS));
        return;
      }
      if (apiKeys.length > 0) {
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
      } else {
        localStorage.removeItem('apiKeys');
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Failed to save data to storage.');
    }
  }, [proxies, apiKeys]);

  const handleAddProxies = (newProxies: { host: string; port: string; username?: string; password?: string; name: string; type: string }[]) => {
    const duplicates = newProxies.filter(newProxy =>
      proxies.some(existingProxy =>
        existingProxy.host === newProxy.host && existingProxy.port === parseInt(newProxy.port, 10)
      )
    );

    if (duplicates.length > 0) {
      const duplicateList = duplicates.map(p => `${p.host}:${p.port}`).join(', ');
      alert(`Duplicate proxies detected: ${duplicateList}. These will not be added.`);
    }

    const filteredProxies = newProxies.filter(newProxy =>
      !proxies.some(existingProxy =>
        existingProxy.host === newProxy.host && existingProxy.port === parseInt(newProxy.port, 10)
      )
    );

    if (filteredProxies.length === 0) return;

    if (proxies.length + filteredProxies.length > MAX_PROXIES) {
      alert(`Cannot add proxies. Maximum limit of ${MAX_PROXIES} proxies reached.`);
      return;
    }

    setProxies((prev) => [
      ...prev,
      ...filteredProxies
        .filter(p => p.host && p.port && !isNaN(parseInt(p.port, 10)) && p.name && p.type)
        .map((p) => ({
          ...p,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `proxy-${Date.now()}-${Math.random()}`,
          port: parseInt(p.port, 10),
          location: 'Unknown',
          status: 'inactive' as const,
          lastChecked: 'Just added',
          type: p.type || 'http',
        })),
    ]);
  };

  const handleAddApiKey = (newApiKey: { name: string; service: string; apiKey: string; endpoint: string }) => {
    const isDuplicate = apiKeys.some(k => k.apiKey === newApiKey.apiKey);
    if (isDuplicate) {
      alert(`An API key with value ${newApiKey.apiKey} already exists.`);
      return;
    }

    if (apiKeys.length >= MAX_API_KEYS) {
      alert(`Cannot add API key. Maximum limit of ${MAX_API_KEYS} API keys reached.`);
      return;
    }

    setApiKeys(prev => [
      ...prev,
      {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `key-${Date.now()}-${Math.random()}`,
        name: newApiKey.name,
        service: newApiKey.service,
        apiKey: newApiKey.apiKey,
        endpoint: newApiKey.endpoint,
        status: 'inactive' as const,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        usageCount: 0,
      },
    ]);
  };

  const handleDownloadJson = () => {
    try {
      const data = {
        proxies: proxies.slice(0, MAX_PROXIES),
        apiKeys: apiKeys.slice(0, MAX_API_KEYS),
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading JSON:', error);
      alert('Failed to download data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your proxies and API keys efficiently</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('proxies')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'proxies' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-server-line" />
                    <span>Proxies</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('apikeys')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'apikeys' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-key-line" />
                    <span>API Keys</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'proxies' ? 'Proxy Management' : 'API Key Management'}
                </h2>
                <div className="flex space-x-2">
                  {activeTab === 'proxies' && (
                    <Button onClick={handleDownloadJson} className="flex items-center space-x-2">
                      <i className="ri-download-line" />
                      <span>Download JSON</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => (activeTab === 'proxies' ? setIsProxyModalOpen(true) : setIsApiKeyModalOpen(true))}
                    className="flex items-center space-x-2"
                  >
                    <i className="ri-add-line" />
                    <span>Add {activeTab === 'proxies' ? 'Proxy' : 'API Key'}</span>
                  </Button>
                </div>
              </div>

              {activeTab === 'proxies' ? (
                <ProxyList proxies={proxies} setProxies={setProxies} />
              ) : (
                <ApiKeyList apiKeys={apiKeys} setApiKeys={setApiKeys} />
              )}
            </div>
          </div>
        </div>
      </main>

      <AddProxyModal
        isOpen={isProxyModalOpen}
        onClose={() => setIsProxyModalOpen(false)}
        onSubmit={handleAddProxies}
      />

      <AddApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSubmit={handleAddApiKey}
      />
    </div>
  );
}

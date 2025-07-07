'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ProxyList from './ProxyList';
import ApiKeyList from './ApiKeyList';
import AddProxyModal from './AddProxyModal';
import AddApiKeyModal from './AddApiKeyModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('proxies');
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

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
                    activeTab === 'proxies'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-server-line"></i>
                    <span>Proxies</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('apikeys')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'apikeys'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-key-line"></i>
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
                <Button
                  onClick={() => activeTab === 'proxies' ? setIsProxyModalOpen(true) : setIsApiKeyModalOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <i className="ri-add-line"></i>
                  <span>Add {activeTab === 'proxies' ? 'Proxy' : 'API Key'}</span>
                </Button>
              </div>

              {activeTab === 'proxies' ? <ProxyList /> : <ApiKeyList />}
            </div>
          </div>
        </div>
      </main>

      <AddProxyModal
        isOpen={isProxyModalOpen}
        onClose={() => setIsProxyModalOpen(false)}
      />

      <AddApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}
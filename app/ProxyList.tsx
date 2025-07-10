'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import EditProxyModal from './EditProxyModal';

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

interface ProxyListProps {
  proxies: Proxy[];
  setProxies: React.Dispatch<React.SetStateAction<Proxy[]>>;
}

export default function ProxyList({ proxies, setProxies }: ProxyListProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<Proxy | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    console.log('ProxyList mounted');
    return () => console.log('ProxyList unmounted');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-yellow-700 bg-yellow-100';
      case 'error': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const testProxy = async (id: string) => {
    const proxy = proxies.find(p => p.id === id);
    if (!proxy) return;

    try {
      const testUrl = 'http://httpbin.org/get';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(testUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setProxies(prev => {
          const newProxies = prev.map(p =>
            p.id === id
              ? { ...p, status: 'active' as const, lastChecked: new Date().toISOString() }
              : p
          );
          localStorage.setItem('proxies', JSON.stringify(newProxies));
          return newProxies;
        });
      } else {
        throw new Error('Proxy request failed');
      }
    } catch (error) {
      console.error(`Error testing proxy ${proxy.host}:${proxy.port}:`, error);
      setProxies(prev => {
        const newProxies = prev.map(p =>
          p.id === id
            ? { ...p, status: 'error' as const, lastChecked: new Date().toISOString() }
            : p
        );
        localStorage.setItem('proxies', JSON.stringify(newProxies));
        return newProxies;
      });
    }
  };

  const deleteProxy = (id: string) => {
    setProxies(prev => {
      const newProxies = prev.filter(proxy => proxy.id !== id);
      if (newProxies.length > 0) {
        localStorage.setItem('proxies', JSON.stringify(newProxies));
      } else {
        localStorage.removeItem('proxies');
      }
      return newProxies;
    });
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const deleteSelectedProxies = () => {
    if (selectedIds.length === 0) {
      alert('No proxies selected for deletion.');
      return;
    }
    setProxies(prev => {
      const newProxies = prev.filter(proxy => !selectedIds.includes(proxy.id));
      if (newProxies.length > 0) {
        localStorage.setItem('proxies', JSON.stringify(newProxies));
      } else {
        localStorage.removeItem('proxies');
      }
      return newProxies;
    });
    setSelectedIds([]);
  };

  const editProxy = (updatedProxy: Proxy) => {
    const isDuplicate = proxies.some(
      p =>
        p.id !== updatedProxy.id &&
        p.host === updatedProxy.host &&
        p.port === updatedProxy.port
    );

    if (isDuplicate) {
      alert(`A proxy with ${updatedProxy.host}:${updatedProxy.port} already exists.`);
      return;
    }

    setProxies(prev => {
      const newProxies = prev.map(p =>
        p.id === updatedProxy.id ? updatedProxy : p
      );
      localStorage.setItem('proxies', JSON.stringify(newProxies));
      return newProxies;
    });
  };

  const openEditModal = (proxy: Proxy) => {
    setSelectedProxy(proxy);
    setIsEditModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === proxies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(proxies.map(proxy => proxy.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {proxies.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-server-line text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proxies configured</h3>
          <p className="text-gray-500">Add your first proxy to get started</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIds.length === proxies.length && proxies.length > 0}
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
              onClick={deleteSelectedProxies}
              disabled={selectedIds.length === 0}
              className="flex items-center space-x-1"
            >
              <i className="ri-delete-bin-line" />
              <span>Delete Selected</span>
            </Button>
          </div>
          {proxies.map((proxy) => (
            <div key={proxy.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(proxy.id)}
                    onChange={() => toggleSelect(proxy.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{proxy.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proxy.status)}`}>
                        {proxy.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <i className="ri-global-line" />
                          <span>{proxy.host}:{proxy.port}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-map-pin-line" />
                          <span>{proxy.location}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {proxy.username && (
                          <span className="flex items-center space-x-1">
                            <i className="ri-user-line" />
                            <span>{proxy.username}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <i className="ri-time-line" />
                          <span>Last checked: {proxy.lastChecked}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-link" />
                          <span>Type: {proxy.type}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => testProxy(proxy.id)}
                    className="flex items-center space-x-1"
                  >
                    <i className="ri-refresh-line" />
                    <span>Test</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(proxy)}
                    className="flex items-center space-x-1"
                  >
                    <i className="ri-edit-line" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteProxy(proxy.id)}
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
      <EditProxyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={editProxy}
        proxy={selectedProxy}
      />
    </div>
  );
}
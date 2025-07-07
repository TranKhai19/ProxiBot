'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface Proxy {
  id: string;
  name: string;
  host: string;
  port: number;
  username?: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked: string;
  location: string;
}

export default function ProxyList() {
  const [proxies, setProxies] = useState<Proxy[]>([
    {
      id: '1',
      name: 'US East Proxy',
      host: '198.23.45.67',
      port: 8080,
      username: 'user123',
      status: 'active',
      lastChecked: '2 minutes ago',
      location: 'New York, US'
    },
    {
      id: '2',
      name: 'EU Proxy',
      host: '185.67.89.123',
      port: 3128,
      status: 'inactive',
      lastChecked: '15 minutes ago',
      location: 'London, UK'
    },
    {
      id: '3',
      name: 'Asia Pacific',
      host: '103.45.67.89',
      port: 8080,
      username: 'asia_user',
      status: 'error',
      lastChecked: '1 hour ago',
      location: 'Singapore, SG'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-yellow-700 bg-yellow-100';
      case 'error': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const testProxy = (id: string) => {
    setProxies(prev => prev.map(proxy => 
      proxy.id === id 
        ? { ...proxy, status: 'active' as const, lastChecked: 'Just now' }
        : proxy
    ));
  };

  const deleteProxy = (id: string) => {
    setProxies(prev => prev.filter(proxy => proxy.id !== id));
  };

  return (
    <div className="space-y-4">
      {proxies.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-server-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proxies configured</h3>
          <p className="text-gray-500">Add your first proxy to get started</p>
        </div>
      ) : (
        proxies.map((proxy) => (
          <div key={proxy.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
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
                      <i className="ri-global-line"></i>
                      <span>{proxy.host}:{proxy.port}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="ri-map-pin-line"></i>
                      <span>{proxy.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {proxy.username && (
                      <span className="flex items-center space-x-1">
                        <i className="ri-user-line"></i>
                        <span>{proxy.username}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <i className="ri-time-line"></i>
                      <span>Last checked: {proxy.lastChecked}</span>
                    </span>
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
                  onClick={() => deleteProxy(proxy.id)}
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
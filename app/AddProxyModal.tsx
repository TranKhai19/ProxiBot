'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AddProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proxies: { host: string; port: string; username?: string; password?: string; name: string; type: string }[]) => void;
}

export default function AddProxyModal({ isOpen, onClose, onSubmit }: AddProxyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    type: 'http',
  });
  const [proxyInput, setProxyInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let proxies = [];

    if (proxyInput.trim()) {
      proxies = proxyInput
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
          const proxy = parseProxyString(line);
          if (!proxy.host || !proxy.port) {
            setError(`Invalid proxy format: ${line}. Expected ip:port:username:password[:type]`);
            return null;
          }
          return proxy;
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);
    } else {
      if (!formData.host || !formData.port) {
        setError('Host and port are required for single proxy entry.');
        return;
      }
      proxies = [{
        host: formData.host,
        port: formData.port,
        username: formData.username,
        password: formData.password,
        name: formData.name || `${formData.host}:${formData.port}`,
        type: formData.type,
      }];
    }

    if (proxies.length === 0 && error) return;

    onSubmit(proxies);
    onClose();

    setFormData({
      name: '',
      host: '',
      port: '',
      username: '',
      password: '',
      type: 'http',
    });
    setProxyInput('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  function parseProxyString(proxy: string) {
    const parts = proxy.split(':');
    const [host, port, username, password, type] = parts;
    return {
      host: host || '',
      port: port || '',
      username: username || '',
      password: password || '',
      name: host && port ? `${host}:${port}` : '',
      type: type || 'http',
    };
  }

  const handleProxyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProxyInput(value);
    setError(null);

    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        host: '',
        port: '',
        username: '',
        password: '',
        name: '',
        type: 'http',
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Proxy" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}
        {!proxyInput.trim() && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proxy Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., US East Proxy"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host/IP Address
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="198.23.45.67"
                  required={!proxyInput.trim()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8080"
                  required={!proxyInput.trim()}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proxy Type
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="socks4">SOCKS4</option>
                  <option value="socks5">SOCKS5</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="password"
                />
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paste Proxies (ip:port:username:password[:type], one per line)
          </label>
          <textarea
            name="proxyInput"
            value={proxyInput}
            onChange={handleProxyInputChange}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm mb-2"
            placeholder="38.154.227.167:5868:fheilixw:affxwfk8a0j1:http\n198.23.239.134:6540:fheilixw:affxwfk8a0j1:https"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Proxy
          </Button>
        </div>
      </form>
    </Modal>
  );
}
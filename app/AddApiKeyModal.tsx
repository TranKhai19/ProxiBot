'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddApiKeyModal({ isOpen, onClose }: AddApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    service: 'openai',
    apiKey: '',
    endpoint: ''
  });

  const services = [
    { value: 'openai', label: 'OpenAI', icon: 'ri-openai-line' },
    { value: 'anthropic', label: 'Anthropic (Claude)', icon: 'ri-robot-line' },
    { value: 'google', label: 'Google (Gemini)', icon: 'ri-google-line' },
    { value: 'custom', label: 'Custom API', icon: 'ri-code-line' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding API key:', formData);
    onClose();
    setFormData({
      name: '',
      service: 'openai',
      apiKey: '',
      endpoint: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New API Key" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., OpenAI GPT-4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Provider
          </label>
          <div className="relative">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {services.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <textarea
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="Paste your API key here..."
            required
          />
        </div>

        {formData.service === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="url"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://api.example.com/v1"
            />
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <i className="ri-information-line text-blue-500 mt-0.5"></i>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Security Note</p>
              <p>Your API keys are stored securely and never shared. They are only used for making requests to the respective AI services.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add API Key
          </Button>
        </div>
      </form>
    </Modal>
  );
}
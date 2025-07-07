'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoSaveChats: true,
    enableNotifications: true,
    defaultModel: 'gpt-4',
    maxTokens: 2048,
    temperature: 0.7,
    theme: 'light',
    language: 'en'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Save settings logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure your application preferences and AI model settings</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-3-line mr-2"></i>
                General Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Auto-save Chat History</label>
                    <p className="text-sm text-gray-600">Automatically save your conversations</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoSaveChats', !settings.autoSaveChats)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.autoSaveChats ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoSaveChats ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Enable Notifications</label>
                    <p className="text-sm text-gray-600">Get notified when AI responses are ready</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">Theme</label>
                  <div className="relative">
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-robot-line mr-2"></i>
                AI Model Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-2">Default AI Model</label>
                  <div className="relative">
                    <select
                      value={settings.defaultModel}
                      onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Max Tokens: {settings.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>256</span>
                    <span>4096</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Temperature: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Focused)</span>
                    <span>2 (Creative)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-shield-line mr-2"></i>
                Security & Privacy
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-blue-500 mt-0.5"></i>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Data Protection</p>
                      <p>All API keys and proxy configurations are stored locally and encrypted. Your chat history is never shared with third parties.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-gray-900">Clear Chat History</span>
                  <Button variant="danger" size="sm" className="flex items-center space-x-1">
                    <i className="ri-delete-bin-line"></i>
                    <span>Clear All</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-gray-900">Export Settings</span>
                  <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                    <i className="ri-download-line"></i>
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="secondary">Reset to Defaults</Button>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <i className="ri-save-line"></i>
                <span>Save Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { href: '/chat', label: 'AI Chat', icon: 'ri-chat-3-line' },
    { href: '/settings', label: 'Settings', icon: 'ri-settings-3-line' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-cpu-line text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">ProxyBot</span>
            </Link>
            
            <nav className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
              <i className="ri-notification-line text-lg"></i>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer">
              <i className="ri-user-line text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
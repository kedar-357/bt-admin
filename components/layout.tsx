import React, { useState, useEffect } from 'react';
import { Button } from './ui';
import { clsx } from 'clsx';
import { 
  HomeIcon, DocumentTextIcon, ShoppingCartIcon, CurrencyPoundIcon, 
  MapPinIcon, LifebuoyIcon, BellIcon, 
  MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon,
  TruckIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/outline';
import { User, Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  notifications: Notification[];
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, user, notifications, activePath, onNavigate, onLogout, searchQuery, onSearchChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Quotes', path: '/quotes', icon: DocumentTextIcon },
    { name: 'Orders', path: '/orders', icon: ShoppingCartIcon },
    { name: 'Invoices', path: '/invoices', icon: CurrencyPoundIcon },
    { name: 'Sites', path: '/sites', icon: MapPinIcon },
    { name: 'Suppliers', path: '/suppliers', icon: TruckIcon },
    { name: 'Support', path: '/support', icon: LifebuoyIcon },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-bt-bg dark:bg-bt-darkBg flex flex-col font-sans transition-colors duration-300">
      {/* Top Bar */}
      <header className="bg-bt-indigo text-white shadow-md sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6 transition-all border-b border-bt-indigoActive">
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-white/10 focus:ring-2 focus:ring-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('/')}>
            <div className="h-10 w-10 rounded-full bg-white text-bt-indigo flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <span className="font-bold text-lg leading-none tracking-tighter select-none">BT</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white antialiased hidden sm:block">Business</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden md:flex relative text-gray-900 group">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-bt-indigo transition-colors" />
            <input 
              type="text" 
              placeholder="Search everything..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white border-0 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all w-48 lg:w-64 shadow-md dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>

          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-white/10 relative focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-bt-error ring-2 ring-bt-indigo animate-pulse" />
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-popover py-2 z-50 text-bt-text animate-in fade-in slide-in-from-top-2 border border-gray-100 ring-1 ring-black/5 dark:bg-bt-darkCard dark:border-slate-700 dark:text-slate-100">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl dark:bg-slate-800/50 dark:border-slate-700">
                  <span className="font-bold text-sm">Notifications</span>
                  <span className="text-xs font-medium text-bt-indigo bg-indigo-50 px-2 py-0.5 rounded-full dark:bg-bt-indigo/20 dark:text-bt-indigoLight">{unreadCount} New</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-8 text-sm text-gray-500 text-center flex flex-col items-center">
                    <BellIcon className="h-8 w-8 text-gray-300 mb-2" />
                    No notifications
                  </div>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <li key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors group dark:hover:bg-slate-800 dark:border-slate-800">
                        <div className="flex items-start">
                          <div className={clsx("h-2.5 w-2.5 mt-1.5 rounded-full mr-3 shrink-0 ring-2 ring-white shadow-sm dark:ring-slate-900", n.type === 'error' ? 'bg-bt-error' : n.type === 'warning' ? 'bg-bt-warning' : n.type === 'success' ? 'bg-bt-success' : 'bg-bt-blue')} />
                          <div>
                            <p className="text-sm font-semibold group-hover:text-bt-indigo transition-colors">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed dark:text-slate-400">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{n.timestamp}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-sm font-semibold tracking-wide">{user?.name}</div>
              <div className="text-xs text-white/80 font-medium">{user?.role}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white/20 text-bt-indigo shrink-0">
              {user?.name.charAt(0)}
            </div>
            <button 
              onClick={onLogout}
              className="text-white/80 hover:text-white ml-1 p-1 rounded hover:bg-white/10 transition-all shrink-0" 
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 overflow-y-auto shadow-sm z-30 dark:bg-bt-darkCard dark:border-slate-800 transition-colors duration-300">
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.path)}
                  className={clsx(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative cursor-pointer",
                    isActive 
                      ? "bg-bt-indigo text-white shadow-md shadow-indigo-100 dark:shadow-none" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-bt-indigo dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-bt-indigoLight"
                  )}
                >
                  <item.icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-bt-indigo dark:group-hover:text-bt-indigoLight")} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full my-auto inset-y-0 dark:bg-bt-indigoLight" />
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 dark:bg-slate-900/50 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 dark:text-slate-500">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Live System</span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-bt-darkCard shadow-2xl flex flex-col transform animate-in slide-in-from-left duration-300">
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800 bg-bt-indigo text-white">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white text-bt-indigo flex items-center justify-center shadow-sm">
                    <span className="font-bold text-sm">BT</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight">Business</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 -mr-2 text-white/80 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={clsx(
                      "w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                      activePath === item.path ? "bg-bt-indigo text-white shadow-lg" : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon className={clsx("h-6 w-6", activePath === item.path ? "text-white" : "text-gray-400")} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth bg-gray-50/30 dark:bg-bt-darkBg transition-colors duration-300">
           {children}
        </main>
      </div>
    </div>
  );
};
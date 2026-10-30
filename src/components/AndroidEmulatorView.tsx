import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Shield,
  Layers,
  MoreVertical,
  Plus,
  X,
  Search,
  ExternalLink,
  BookOpen,
  Download,
  Settings,
  Share2,
  Lock,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { Tab, PrivacyStats } from '../shared/types';
import { OFFICIAL_BRAND, DEFAULT_SHORTCUTS } from '../shared/defaults';

interface AndroidEmulatorViewProps {
  privacyStats: PrivacyStats;
  onOpenPrivacyCenter: () => void;
  onOpenSettings: () => void;
  onOpenAI: () => void;
}

export const AndroidEmulatorView: React.FC<AndroidEmulatorViewProps> = ({
  privacyStats,
  onOpenPrivacyCenter,
  onOpenSettings,
  onOpenAI,
}) => {
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
  const [currentUrl, setCurrentUrl] = useState('mitra://home');
  const [inputUrl, setInputUrl] = useState('');
  const [tabs, setTabs] = useState<Array<{ id: string; title: string; url: string; isIncognito?: boolean }>>([
    { id: '1', title: 'MITRA Home', url: 'mitra://home' },
    { id: '2', title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDesktopSite, setIsDesktopSite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleNavigate = (url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    setInputUrl(url === 'mitra://home' ? '' : url);
    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, url, title: url === 'mitra://home' ? 'MITRA Home' : new URL(url).hostname } : t))
    );
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    const q = inputUrl.trim();
    if (q.startsWith('http://') || q.startsWith('https://')) {
      handleNavigate(q);
    } else if (q.includes('.') && !q.includes(' ')) {
      handleNavigate(`https://${q}`);
    } else {
      handleNavigate(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleNewTab = (isIncognito = false) => {
    const newId = Date.now().toString();
    const newTab = {
      id: newId,
      title: isIncognito ? 'Incognito Tab' : 'MITRA Home',
      url: 'mitra://home',
      isIncognito,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setCurrentUrl('mitra://home');
    setInputUrl('');
    setShowTabSwitcher(false);
    setShowMenu(false);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = tabs.filter(t => t.id !== id);
    if (remaining.length === 0) {
      handleNewTab();
    } else {
      setTabs(remaining);
      if (activeTabId === id) {
        setActiveTabId(remaining[remaining.length - 1].id);
        setCurrentUrl(remaining[remaining.length - 1].url);
      }
    }
  };

  return (
    <div className="flex-1 bg-[#060A1D] flex flex-col items-center justify-center p-4 overflow-y-auto select-none">
      {/* Device frame toggle controls */}
      <div className="flex items-center gap-3 mb-4 bg-[#0B1025] border border-slate-800 px-3 py-1.5 rounded-xl text-xs z-10">
        <span className="text-slate-400 font-medium">Android Preview:</span>
        <button
          onClick={() => setDeviceType('phone')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            deviceType === 'phone' ? 'bg-[#00D9FF] text-black font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Pixel 9 Pro</span>
        </button>
        <button
          onClick={() => setDeviceType('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            deviceType === 'tablet' ? 'bg-[#8B35FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Pixel Tablet</span>
        </button>
      </div>

      {/* Android Device Bezel Chassis */}
      <div
        className={`bg-[#080D24] border-[8px] border-slate-800 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(0,217,255,0.15)] flex flex-col overflow-hidden relative transition-all duration-300 ${
          deviceType === 'phone' ? 'w-[380px] h-[760px]' : 'w-[720px] h-[580px]'
        }`}
      >
        {/* Android Status Bar */}
        <div className="h-7 bg-[#080D24] px-6 flex items-center justify-between text-[11px] text-slate-400 z-30 shrink-0">
          <span>09:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" /> {/* Dynamic Island / Camera punch */}
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Top Native Mobile Address Bar */}
        <div className="h-12 bg-[#0B1025] border-b border-slate-800 px-3 flex items-center gap-2 z-20 shrink-0">
          <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center bg-[#080D24] rounded-full px-3 py-1.5 border border-slate-700/80">
            <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Search or enter URL"
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </form>

          {/* Tab counter badge */}
          <button
            onClick={() => setShowTabSwitcher(!showTabSwitcher)}
            className="w-7 h-7 rounded-lg border border-slate-700 text-xs font-bold text-[#00D9FF] flex items-center justify-center hover:bg-slate-800"
          >
            {tabs.length}
          </button>

          {/* Overflow Menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Bar */}
        {isLoading && (
          <div className="h-0.5 bg-gradient-to-r from-[#00D9FF] to-[#8B35FF] animate-pulse w-full shrink-0" />
        )}

        {/* Viewport Content Area */}
        <div className="flex-1 overflow-hidden relative bg-[#080D24]">
          {/* Tab Switcher Grid View */}
          {showTabSwitcher ? (
            <div className="absolute inset-0 bg-[#080D24] p-4 overflow-y-auto z-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Open Tabs ({tabs.length})</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNewTab(true)}
                    className="px-2.5 py-1 text-xs bg-slate-800 text-purple-300 rounded-lg hover:bg-slate-700"
                  >
                    + Incognito
                  </button>
                  <button
                    onClick={() => handleNewTab(false)}
                    className="px-2.5 py-1 text-xs bg-[#00D9FF] text-black font-bold rounded-lg hover:bg-cyan-300"
                  >
                    + New Tab
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tabs.map(tab => (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveTabId(tab.id);
                      setCurrentUrl(tab.url);
                      setInputUrl(tab.url === 'mitra://home' ? '' : tab.url);
                      setShowTabSwitcher(false);
                    }}
                    className={`rounded-2xl border p-3 flex flex-col justify-between h-36 cursor-pointer relative transition-all ${
                      tab.id === activeTabId
                        ? 'border-[#00D9FF] bg-[#0F1738] shadow-lg'
                        : 'border-slate-800 bg-[#0B1025] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span className="truncate max-w-[100px]">{tab.title}</span>
                      <button
                        onClick={e => handleCloseTab(tab.id, e)}
                        className="p-1 hover:text-red-400 text-slate-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center opacity-30 text-[10px] text-slate-400 font-mono">
                      {tab.url}
                    </div>

                    <div className="text-[10px] text-cyan-400 font-medium">
                      {tab.isIncognito ? 'Private Session' : 'Active Tab'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentUrl === 'mitra://home' ? (
            /* Android Home View */
            <div className="h-full overflow-y-auto p-4 flex flex-col items-center justify-between text-center">
              <div className="my-auto py-6">
                <img
                  src={OFFICIAL_BRAND.logoUrl}
                  alt="MITRA"
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <h2 className="text-xl font-black text-white">{OFFICIAL_BRAND.name}</h2>
                <p className="text-[11px] text-cyan-400 uppercase tracking-widest">{OFFICIAL_BRAND.tagline}</p>

                {/* Shortcuts 4x2 grid */}
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {DEFAULT_SHORTCUTS.slice(0, 8).map(sc => (
                    <div
                      key={sc.id}
                      onClick={() => handleNavigate(sc.url)}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs text-white shadow-md mb-1"
                        style={{ backgroundColor: sc.color }}
                      >
                        {sc.title.charAt(0)}
                      </div>
                      <span className="text-[10px] text-slate-300 truncate max-w-[50px]">{sc.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Android Privacy Shield Pill */}
              <div
                onClick={onOpenPrivacyCenter}
                className="w-full p-3 rounded-2xl bg-[#0B1025] border border-slate-800 flex items-center justify-between text-xs cursor-pointer mb-2"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Ad & Tracker Shield</span>
                </div>
                <span className="font-bold text-[#00D9FF]">{privacyStats.trackersBlockedTotal} Blocked</span>
              </div>
            </div>
          ) : (
            /* Real Mobile Chromium Browsing */
            <iframe
              src={`/api/browser/proxy?url=${encodeURIComponent(currentUrl)}`}
              title="Android WebView"
              className="w-full h-full border-none"
            />
          )}

          {/* Android Bottom Sheet Menu */}
          {showMenu && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#0B1025] border-t border-slate-700 rounded-t-3xl p-4 shadow-2xl z-50 text-xs space-y-2">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
              <button
                onClick={() => handleNewTab(false)}
                className="w-full flex items-center gap-3 p-2 text-left text-slate-200 hover:bg-slate-800 rounded-xl"
              >
                <Plus className="w-4 h-4 text-[#00D9FF]" /> New Tab
              </button>
              <button
                onClick={() => handleNewTab(true)}
                className="w-full flex items-center gap-3 p-2 text-left text-purple-300 hover:bg-slate-800 rounded-xl"
              >
                <Lock className="w-4 h-4 text-[#8B35FF]" /> New Incognito Tab
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenAI();
                }}
                className="w-full flex items-center gap-3 p-2 text-left text-cyan-300 hover:bg-slate-800 rounded-xl"
              >
                <Shield className="w-4 h-4 text-[#00D9FF]" /> MITRA AI Assistant
              </button>
              <button
                onClick={() => {
                  setIsDesktopSite(!isDesktopSite);
                  setShowMenu(false);
                }}
                className="w-full flex items-center justify-between p-2 text-slate-200 hover:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4" /> Request Desktop Site
                </div>
                <span className="text-[10px] text-cyan-400">{isDesktopSite ? 'ON' : 'OFF'}</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-3 p-2 text-left text-slate-200 hover:bg-slate-800 rounded-xl"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          )}
        </div>

        {/* Bottom Native Android Navigation Bar */}
        <div className="h-12 bg-[#0B1025] border-t border-slate-800 px-4 flex items-center justify-between text-slate-400 z-30 shrink-0">
          <button
            onClick={() => handleNavigate('mitra://home')}
            className="p-1.5 hover:text-white"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.history.back()}
            className="p-1.5 hover:text-white"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavigate(currentUrl)}
            className="p-1.5 hover:text-white"
            title="Reload"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowTabSwitcher(!showTabSwitcher)}
            className="p-1.5 hover:text-white"
            title="Tabs"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:text-white"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

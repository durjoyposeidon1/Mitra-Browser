import React, { useState, useEffect } from 'react';
import { Search, Shield, Zap, Plus, ExternalLink, Sparkles, Clock, CloudSun, Trash2, Globe } from 'lucide-react';
import { OFFICIAL_BRAND, DEFAULT_SHORTCUTS } from '../shared/defaults';
import { QuickShortcut, PrivacyStats } from '../shared/types';

interface MitraHomepageProps {
  onNavigate: (url: string) => void;
  privacyStats: PrivacyStats;
  onOpenPrivacyCenter: () => void;
  onOpenAI: () => void;
}

export const MitraHomepage: React.FC<MitraHomepageProps> = ({
  onNavigate,
  privacyStats,
  onOpenPrivacyCenter,
  onOpenAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<'google' | 'duckduckgo' | 'bing' | 'brave'>('google');
  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>(() => {
    const saved = localStorage.getItem('mitra_shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    if (query.startsWith('http://') || query.startsWith('https://')) {
      onNavigate(query);
    } else if (query.includes('.') && !query.includes(' ')) {
      onNavigate(`https://${query}`);
    } else {
      const searchUrls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        brave: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
      };
      onNavigate(searchUrls[searchEngine]);
    }
  };

  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    const updated = [...shortcuts, { id: Date.now().toString(), title: newTitle, url: formattedUrl }];
    setShortcuts(updated);
    localStorage.setItem('mitra_shortcuts', JSON.stringify(updated));
    setNewTitle('');
    setNewUrl('');
    setIsAddingShortcut(false);
  };

  const handleDeleteShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = shortcuts.filter(s => s.id !== id);
    setShortcuts(updated);
    localStorage.setItem('mitra_shortcuts', JSON.stringify(updated));
  };

  const formatBandwidth = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#080D24] text-white flex flex-col items-center justify-between p-6 sm:p-10 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00D9FF]/10 via-[#2864FF]/10 to-[#8B35FF]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header info (Clock & Weather) */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CloudSun className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>72°F • Silicon Valley, CA</span>
        </div>
      </div>

      {/* Center Branding & Search */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center my-auto z-10 py-6">
        {/* Official Brand Logo */}
        <div className="relative group cursor-pointer mb-3">
          <img
            src={OFFICIAL_BRAND.logoUrl}
            alt="MITRA BROWSER"
            className="w-24 h-24 object-contain filter drop-shadow-[0_10px_25px_rgba(0,217,255,0.3)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
          {OFFICIAL_BRAND.name}
        </h1>
        <p className="text-sm font-medium text-cyan-400/90 tracking-widest uppercase mt-1 mb-6">
          {OFFICIAL_BRAND.tagline}
        </p>

        <p className="text-sm text-slate-400 mb-6">
          {getGreeting()}, ready to explore the open web with intelligent security?
        </p>

        {/* Large Smart Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative group">
          <div className="relative flex items-center bg-[#0B1025]/90 border border-slate-700/80 hover:border-[#00D9FF]/50 focus-within:border-[#00D9FF] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 p-1.5">
            <div className="pl-3.5 pr-2 flex items-center">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#00D9FF] transition-colors" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Google or type a URL..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-base py-3 px-2 focus:outline-none"
              autoFocus
            />

            {/* Search Engine Switcher Dropdown */}
            <div className="flex items-center gap-1 pr-2">
              <select
                value={searchEngine}
                onChange={e => setSearchEngine(e.target.value as any)}
                className="bg-[#080D24] text-xs text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00D9FF] cursor-pointer"
              >
                <option value="google">Google</option>
                <option value="duckduckgo">DuckDuckGo</option>
                <option value="bing">Bing</option>
                <option value="brave">Brave</option>
              </select>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#00D9FF] to-[#2864FF] hover:from-[#00c0e4] hover:to-[#1e54e0] text-black font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                Go
              </button>
            </div>
          </div>
        </form>

        {/* Quick Shortcuts Grid */}
        <div className="w-full mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Shortcuts</span>
            <button
              onClick={() => setIsAddingShortcut(true)}
              className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Shortcut
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {shortcuts.map(sc => (
              <div
                key={sc.id}
                onClick={() => onNavigate(sc.url)}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-[#0B1025]/70 border border-slate-800/80 hover:border-[#00D9FF]/40 hover:bg-[#0F1738] transition-all cursor-pointer backdrop-blur-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-md text-white font-bold text-sm"
                  style={{ backgroundColor: sc.color || '#2864FF' }}
                >
                  {sc.title.charAt(0)}
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[70px] text-center">
                  {sc.title}
                </span>

                <button
                  onClick={e => handleDeleteShortcut(sc.id, e)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 transition-opacity"
                  title="Remove shortcut"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Shortcut Modal */}
          {isAddingShortcut && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0B1025] border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="text-base font-bold text-white mb-4">Add Website Shortcut</h3>
                <form onSubmit={handleAddShortcut} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Shortcut Name</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. GitHub"
                      className="w-full bg-[#080D24] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Web Address (URL)</label>
                    <input
                      type="text"
                      value={newUrl}
                      onChange={e => setNewUrl(e.target.value)}
                      placeholder="e.g. github.com"
                      className="w-full bg-[#080D24] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingShortcut(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#00D9FF] text-black rounded-lg hover:bg-cyan-300"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Privacy & Telemetry Bar */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 z-10 pt-4">
        <div
          onClick={onOpenPrivacyCenter}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1025]/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Trackers Blocked</div>
            <div className="text-base font-bold text-white">{privacyStats.trackersBlockedTotal} items</div>
          </div>
        </div>

        <div
          onClick={onOpenPrivacyCenter}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1025]/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-[#00D9FF]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Bandwidth Saved</div>
            <div className="text-base font-bold text-white">{formatBandwidth(privacyStats.bandwidthSavedBytes)}</div>
          </div>
        </div>

        <div
          onClick={onOpenAI}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#2864FF]/10 to-[#8B35FF]/15 border border-[#8B35FF]/30 hover:border-[#00D9FF]/50 cursor-pointer transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D9FF] to-[#8B35FF] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-cyan-300 font-medium">MITRA AI Ready</div>
            <div className="text-xs text-slate-400">Summarize & ask anything</div>
          </div>
        </div>
      </div>
    </div>
  );
};

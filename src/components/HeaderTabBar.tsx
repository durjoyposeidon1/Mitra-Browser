import React from 'react';
import { Plus, X, Pin, Volume2, VolumeX, Smartphone, Monitor, Code2, Globe, Shield, RefreshCw } from 'lucide-react';
import { Tab, TabGroup } from '../shared/types';
import { OFFICIAL_BRAND } from '../shared/defaults';

interface HeaderTabBarProps {
  tabs: Tab[];
  activeTabId: string;
  tabGroups: TabGroup[];
  platformMode: 'desktop' | 'android' | 'architecture';
  onSelectTab: (id: string) => void;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
  onTogglePinTab: (id: string) => void;
  onToggleMuteTab: (id: string) => void;
  onSetPlatformMode: (mode: 'desktop' | 'android' | 'architecture') => void;
}

export const HeaderTabBar: React.FC<HeaderTabBarProps> = ({
  tabs,
  activeTabId,
  tabGroups,
  platformMode,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onTogglePinTab,
  onToggleMuteTab,
  onSetPlatformMode,
}) => {
  return (
    <div className="h-11 bg-[#080D24] border-b border-slate-800/80 flex items-center justify-between select-none px-2 relative z-30">
      {/* Left: MITRA Logo & Platform Switcher */}
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#0B1025] border border-slate-800 shadow-sm">
          <img
            src={OFFICIAL_BRAND.logoUrl}
            alt="MITRA Emblem"
            className="w-5 h-5 object-contain"
          />
          <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hidden sm:inline">
            MITRA
          </span>
        </div>

        {/* Platform Architecture Switcher */}
        <div className="flex items-center bg-[#0B1025] rounded-lg p-0.5 border border-slate-800 text-xs">
          <button
            onClick={() => onSetPlatformMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              platformMode === 'desktop'
                ? 'bg-gradient-to-r from-[#00D9FF]/20 to-[#2864FF]/20 text-[#00D9FF] border border-[#00D9FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop Chromium View (Windows 11 / Electron)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => onSetPlatformMode('android')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              platformMode === 'android'
                ? 'bg-gradient-to-r from-[#8B35FF]/20 to-[#C735E8]/20 text-[#C735E8] border border-[#C735E8]/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Android Native View (Kotlin WebView / Material 3)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Android</span>
          </button>

          <button
            onClick={() => onSetPlatformMode('architecture')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              platformMode === 'architecture'
                ? 'bg-[#2864FF]/20 text-cyan-300 border border-[#2864FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="System Architecture & Source Code Hub"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Codebase Hub</span>
          </button>
        </div>
      </div>

      {/* Center: Desktop Tabs Strip */}
      {platformMode === 'desktop' && (
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-4xl px-1">
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const group = tabGroups.find(g => g.id === tab.groupId);

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 h-8 px-3 rounded-t-lg text-xs cursor-pointer border-t-2 transition-all ${
                  isActive
                    ? 'bg-[#0F1738] text-white border-[#00D9FF] shadow-md z-10'
                    : 'bg-[#080D24]/60 text-slate-400 border-transparent hover:bg-[#0B1025] hover:text-slate-200'
                } ${tab.isPinned ? 'w-10 justify-center px-1' : 'min-w-[120px] max-w-[200px]'}`}
              >
                {/* Tab Group Indicator Dot */}
                {group && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                    title={`Group: ${group.title}`}
                  />
                )}

                {/* Loading indicator or Favicon */}
                {tab.isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 text-[#00D9FF] animate-spin shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}

                {/* Tab Title (hidden if pinned) */}
                {!tab.isPinned && (
                  <span className="truncate flex-1 font-medium">{tab.title || 'New Tab'}</span>
                )}

                {/* Audio Playing Icon */}
                {tab.audioPlaying && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleMuteTab(tab.id);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    {tab.audioMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-[#00D9FF]" />}
                  </button>
                )}

                {/* Close Button or Pin Icon */}
                {tab.isPinned ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onTogglePinTab(tab.id);
                    }}
                    className="text-slate-400 hover:text-white"
                    title="Unpin Tab"
                  >
                    <Pin className="w-3 h-3 rotate-45" />
                  </button>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-slate-700/60 text-slate-400 hover:text-white transition-opacity"
                    title="Close Tab (Ctrl+W)"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={onNewTab}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1025] transition-colors"
            title="Open New Tab (Ctrl+T)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right: Window Controls (Desktop Electron Window Styling) */}
      <div className="flex items-center gap-2 pl-2">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-400 bg-[#0B1025] rounded-md border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.2-Prod</span>
        </div>

        {/* Window controls styling */}
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 rounded text-xs">
            ─
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-800 rounded text-xs">
            □
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white rounded text-xs">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

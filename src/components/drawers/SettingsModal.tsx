import React, { useState } from 'react';
import {
  Settings,
  Search,
  Sliders,
  Shield,
  Download,
  Palette,
  Sparkles,
  KeyRound,
  Globe,
  Info,
  Layers,
  X,
  Check,
} from 'lucide-react';
import { BrowserSettings } from '../../shared/types';
import { OFFICIAL_BRAND } from '../../shared/defaults';

interface SettingsModalProps {
  isOpen: boolean;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');

  if (!isOpen) return null;

  const categories = [
    { id: 'general', label: '1. General', icon: Sliders },
    { id: 'appearance', label: '2. Appearance', icon: Palette },
    { id: 'search', label: '3. Search Engine', icon: Search },
    { id: 'tabs', label: '4. Tabs & Windows', icon: Layers },
    { id: 'privacy', label: '5. Privacy & Security', icon: Shield },
    { id: 'adblock', label: '6. Ad & Tracker Blocker', icon: Shield },
    { id: 'downloads', label: '7. Downloads', icon: Download },
    { id: 'passwords', label: '8. Password Manager', icon: KeyRound },
    { id: 'ai', label: '9. MITRA AI Assistant', icon: Sparkles },
    { id: 'permissions', label: '10. Site Permissions', icon: Globe },
    { id: 'about', label: '11. About MITRA Browser', icon: Info },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1025] border border-slate-700/80 rounded-2xl w-full max-w-3xl h-[600px] shadow-2xl flex overflow-hidden text-xs">
        {/* Left Sidebar Categories */}
        <div className="w-56 bg-[#080D24] border-r border-slate-800 p-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-3 mb-2 border-b border-slate-800">
              <Settings className="w-4 h-4 text-[#00D9FF]" />
              <span className="font-bold text-white text-sm">Settings</span>
            </div>

            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-left transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#00D9FF]/15 text-[#00D9FF] font-semibold border border-[#00D9FF]/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 px-2 py-2 border-t border-slate-800">
            MITRA BROWSER {OFFICIAL_BRAND.version}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-[#0B1025]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
            <h3 className="font-bold text-white text-sm capitalize">{selectedCategory} Settings</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {selectedCategory === 'general' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-1">On Startup</h4>
                  <div className="space-y-2 text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="startup"
                        checked={settings.startupBehavior === 'newtab'}
                        onChange={() => onUpdateSettings({ startupBehavior: 'newtab' })}
                        className="accent-[#00D9FF]"
                      />
                      <span>Open the New Tab page (MITRA Home)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="startup"
                        checked={settings.startupBehavior === 'restore'}
                        onChange={() => onUpdateSettings({ startupBehavior: 'restore' })}
                        className="accent-[#00D9FF]"
                      />
                      <span>Continue where you left off (Restore tabs)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-semibold text-white mb-2">Hardware Acceleration</h4>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#080D24] border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Use GPU hardware acceleration when available</span>
                    <input
                      type="checkbox"
                      checked={settings.hardwareAcceleration}
                      onChange={e => onUpdateSettings({ hardwareAcceleration: e.target.checked })}
                      className="accent-[#00D9FF] w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            )}

            {selectedCategory === 'search' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-1">Default Search Engine in Address Bar</h4>
                <div className="space-y-2 text-slate-300">
                  {[
                    { id: 'google', name: 'Google' },
                    { id: 'duckduckgo', name: 'DuckDuckGo (Privacy Focused)' },
                    { id: 'bing', name: 'Microsoft Bing' },
                    { id: 'brave', name: 'Brave Search' },
                  ].map(engine => (
                    <label key={engine.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080D24] border border-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="searchEngine"
                        checked={settings.defaultSearchEngine === engine.id}
                        onChange={() => onUpdateSettings({ defaultSearchEngine: engine.id as any })}
                        className="accent-[#00D9FF]"
                      />
                      <span>{engine.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory === 'ai' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#00D9FF]/10 to-[#8B35FF]/10 border border-[#00D9FF]/30">
                  <Sparkles className="w-6 h-6 text-[#00D9FF]" />
                  <div>
                    <h4 className="font-bold text-white">MITRA AI Intelligence Core</h4>
                    <p className="text-slate-400 text-[11px]">
                      Uses Google Gemini 3.8 Flash to summarize webpages, explain technical concepts, and research.
                    </p>
                  </div>
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#080D24] border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Enable In-Browser AI Assistant Copilot</span>
                  <input
                    type="checkbox"
                    checked={settings.aiAssistantEnabled}
                    onChange={e => onUpdateSettings({ aiAssistantEnabled: e.target.checked })}
                    className="accent-[#00D9FF] w-4 h-4"
                  />
                </label>
              </div>
            )}

            {selectedCategory === 'about' && (
              <div className="space-y-4 text-center py-4">
                <img
                  src={OFFICIAL_BRAND.logoUrl}
                  alt="MITRA BROWSER"
                  className="w-20 h-20 mx-auto object-contain drop-shadow-[0_4px_20px_rgba(0,217,255,0.3)]"
                />
                <h3 className="text-lg font-black text-white">{OFFICIAL_BRAND.name}</h3>
                <p className="text-xs text-cyan-400 font-semibold">{OFFICIAL_BRAND.tagline}</p>
                <div className="max-w-md mx-auto p-4 rounded-xl bg-[#080D24] border border-slate-800 text-slate-300 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Version</span>
                    <span className="font-mono text-white">{OFFICIAL_BRAND.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Engine Core</span>
                    <span className="font-mono text-cyan-400">{OFFICIAL_BRAND.engineVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform Support</span>
                    <span>Windows 11, macOS, Linux, Android</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

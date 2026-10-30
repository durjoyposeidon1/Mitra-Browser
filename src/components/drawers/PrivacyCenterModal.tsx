import React, { useState } from 'react';
import { Shield, ShieldCheck, Lock, EyeOff, Cookie, Trash2, Check, X, AlertOctagon, Cpu } from 'lucide-react';
import { PrivacyStats, BrowserSettings } from '../../shared/types';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  privacyStats: PrivacyStats;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onClearBrowsingData: () => void;
  onClose: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  privacyStats,
  settings,
  onUpdateSettings,
  onClearBrowsingData,
  onClose,
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    onClearBrowsingData();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1025] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MITRA Privacy & Security Center</h3>
              <p className="text-[10px] text-slate-400">Advanced tracker blocking & secure browsing engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Ads Blocked</div>
              <div className="text-lg font-black text-[#00D9FF] mt-0.5">{privacyStats.adsBlockedTotal}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Trackers Neutralized</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{privacyStats.trackersBlockedTotal}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Bandwidth Saved</div>
              <div className="text-lg font-black text-purple-400 mt-0.5">{formatSize(privacyStats.bandwidthSavedBytes)}</div>
            </div>
          </div>

          {/* Core Protection Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
              Tracking & Ad Protection
            </h4>

            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">MITRA Ad & Tracker Shield</div>
                <div className="text-[10px] text-slate-400">
                  Blocks invasive advertisement networks, fingerprinting beacons, and analytics scripts.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.adBlockerEnabled}
                onChange={e => onUpdateSettings({ adBlockerEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#00D9FF] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">HTTPS-Only Mode</div>
                <div className="text-[10px] text-slate-400">
                  Automatically upgrades unencrypted HTTP connections to secure HTTPS and warns on insecure transport.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.httpsOnlyMode}
                onChange={e => onUpdateSettings({ httpsOnlyMode: e.target.checked })}
                className="w-4 h-4 accent-[#00D9FF] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Block Third-Party Cookies</div>
                <div className="text-[10px] text-slate-400">
                  Prevents cross-site tracking and profiling across different web domains.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.thirdPartyCookiesBlocked}
                onChange={e => onUpdateSettings({ thirdPartyCookiesBlocked: e.target.checked })}
                className="w-4 h-4 accent-[#00D9FF] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#080D24] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Send "Do Not Track" Header</div>
                <div className="text-[10px] text-slate-400">
                  Informs websites that you opt out of behavioral monitoring and analytics.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.doNotTrack}
                onChange={e => onUpdateSettings({ doNotTrack: e.target.checked })}
                className="w-4 h-4 accent-[#00D9FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Browsing Data Clearing */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div>
              <div className="font-bold text-rose-300">Clear Browsing Data</div>
              <div className="text-[10px] text-slate-400">
                Purge browsing history, cache, active tab cookies, and local sessions.
              </div>
            </div>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{clearedNotice ? 'Cleared!' : 'Clear Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

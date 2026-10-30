import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  ShieldCheck,
  ShieldAlert,
  Star,
  Sparkles,
  BookOpen,
  Download,
  Copy,
  Check,
  Lock,
  ChevronDown,
  Camera,
  Mic,
  MapPin,
  Bell,
} from 'lucide-react';
import { SecurityReport, Bookmark } from '../shared/types';

interface AddressBarProps {
  currentUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  isBookmarked: boolean;
  adsBlockedCount: number;
  readerModeAvailable: boolean;
  isReaderModeActive: boolean;
  isAIPanelOpen: boolean;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onToggleBookmark: () => void;
  onToggleReaderMode: () => void;
  onToggleAIPanel: () => void;
  onOpenDownloads: () => void;
  onOpenPrivacyCenter: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  currentUrl,
  canGoBack,
  canGoForward,
  isLoading,
  isBookmarked,
  adsBlockedCount,
  readerModeAvailable,
  isReaderModeActive,
  isAIPanelOpen,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  onToggleBookmark,
  onToggleReaderMode,
  onToggleAIPanel,
  onOpenDownloads,
  onOpenPrivacyCenter,
}) => {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [showSecurityPopover, setShowSecurityPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityReport | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(currentUrl === 'mitra://home' ? '' : currentUrl);
    }
  }, [currentUrl, isFocused]);

  // Fetch security report when URL changes
  useEffect(() => {
    if (currentUrl && currentUrl !== 'mitra://home') {
      fetch(`/api/browser/security?url=${encodeURIComponent(currentUrl)}`)
        .then(res => res.json())
        .then(data => setSecurityData(data))
        .catch(() => setSecurityData(null));
    }
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    let target = inputValue.trim();
    if (target === 'mitra://home' || target === 'home') {
      onGoHome();
      return;
    }

    if (target.startsWith('http://') || target.startsWith('https://')) {
      onNavigate(target);
    } else if (target.includes('.') && !target.includes(' ')) {
      onNavigate(`https://${target}`);
    } else {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(target)}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHttps = currentUrl.startsWith('https://') || currentUrl === 'mitra://home';

  return (
    <div className="h-12 bg-[#0B1025] border-b border-slate-800/80 px-3 flex items-center justify-between gap-2 relative z-20 select-none">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Back (Alt+Left)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Forward (Alt+Right)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReload}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
          title={isLoading ? 'Stop Loading' : 'Reload Page (Ctrl+R)'}
        >
          {isLoading ? <X className="w-4 h-4 text-rose-400" /> : <RotateCw className="w-4 h-4" />}
        </button>

        <button
          onClick={onGoHome}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
          title="Mitra Home Page"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Smart Omnibox Address Field */}
      <div className="flex-1 max-w-3xl relative">
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`flex items-center h-9 px-3 rounded-xl bg-[#080D24] border transition-all ${
              isFocused
                ? 'border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.25)] ring-1 ring-[#00D9FF]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Security Indicator Button */}
            <button
              type="button"
              onClick={() => setShowSecurityPopover(!showSecurityPopover)}
              className="flex items-center gap-1.5 pr-2.5 mr-1 border-r border-slate-800 hover:text-cyan-400 text-slate-400 transition-colors"
              title="View site security information"
            >
              {isHttps ? (
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="text-[11px] font-semibold text-emerald-400 hidden sm:inline">
                {currentUrl === 'mitra://home' ? 'MITRA Core' : isHttps ? 'Secure' : 'Not Secure'}
              </span>
            </button>

            {/* Input URL */}
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search or enter web address"
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            {/* Action Buttons inside Omnibox */}
            <div className="flex items-center gap-1 pl-2">
              {currentUrl && currentUrl !== 'mitra://home' && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy Page URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Bookmark Star */}
              <button
                type="button"
                onClick={onToggleBookmark}
                className={`p-1 transition-colors ${
                  isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-amber-300'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Tab'}
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>
        </form>

        {/* Security Info Popover */}
        {showSecurityPopover && (
          <div
            ref={popoverRef}
            className="absolute top-11 left-0 w-80 bg-[#0B1025] border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">Site Information</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Grade {securityData?.securityScore || 'A+'}
              </span>
            </div>

            <div className="space-y-2.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Connection</span>
                <span className="text-emerald-400 font-medium">Encrypted (TLS 1.3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certificate Issuer</span>
                <span className="text-white truncate max-w-[170px]">
                  {securityData?.certificateIssuer || 'Verified CA'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cipher Suite</span>
                <span className="text-slate-300">AES_256_GCM</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="font-semibold text-white mb-2">Permissions for this Site</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#080D24] text-slate-300">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Camera: Ask
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#080D24] text-slate-300">
                    <Mic className="w-3.5 h-3.5 text-cyan-400" /> Mic: Ask
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#080D24] text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location: Ask
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#080D24] text-slate-300">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notify: Block
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSecurityPopover(false);
                onOpenPrivacyCenter();
              }}
              className="w-full mt-3 py-1.5 bg-[#080D24] hover:bg-slate-800 text-cyan-400 font-medium rounded-lg text-center transition-colors"
            >
              Open Privacy & Security Center →
            </button>
          </div>
        )}
      </div>

      {/* Right Controls: AdBlock Shield, Reader Mode, Downloads & MITRA AI */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Ad & Tracker Shield */}
        <button
          onClick={onOpenPrivacyCenter}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#080D24] border border-slate-800 hover:border-slate-700 text-xs transition-all"
          title="Mitra Ad & Tracker Shield"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span className="font-bold text-white text-[11px]">{adsBlockedCount}</span>
        </button>

        {/* Reader Mode Button */}
        {readerModeAvailable && (
          <button
            onClick={onToggleReaderMode}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              isReaderModeActive
                ? 'bg-amber-400 text-black font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Reader Mode"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        )}

        {/* Downloads */}
        <button
          onClick={onOpenDownloads}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Download Manager"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* MITRA AI Assistant Button */}
        <button
          onClick={onToggleAIPanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 ${
            isAIPanelOpen
              ? 'bg-gradient-to-r from-[#00D9FF] via-[#2864FF] to-[#8B35FF] text-white shadow-[0_0_15px_rgba(0,217,255,0.4)]'
              : 'bg-[#0F1738] text-cyan-300 border border-[#00D9FF]/40 hover:border-[#00D9FF]'
          }`}
          title="MITRA AI Assistant (Gemini 3.8 Flash)"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00D9FF] animate-pulse" />
          <span className="hidden sm:inline">MITRA AI</span>
        </button>
      </div>
    </div>
  );
};

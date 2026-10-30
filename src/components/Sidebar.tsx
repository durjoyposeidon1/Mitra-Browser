import React from 'react';
import {
  Bookmark as BookmarkIcon,
  Clock,
  Download,
  KeyRound,
  Shield,
  Settings,
  BookOpen,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activePanel: 'bookmarks' | 'history' | 'downloads' | 'vault' | 'privacy' | 'settings' | 'ai' | null;
  onTogglePanel: (panel: 'bookmarks' | 'history' | 'downloads' | 'vault' | 'privacy' | 'settings' | 'ai') => void;
  onOpenDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePanel, onTogglePanel, onOpenDocs }) => {
  return (
    <div className="w-12 bg-[#080D24] border-r border-slate-800 flex flex-col items-center justify-between py-3 z-20 select-none">
      {/* Top action icons */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => onTogglePanel('bookmarks')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'bookmarks'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Bookmarks (Ctrl+B)"
        >
          <BookmarkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('history')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'history'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Browsing History (Ctrl+H)"
        >
          <Clock className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('downloads')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'downloads'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Downloads Manager (Ctrl+J)"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('vault')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'vault'
              ? 'bg-[#8B35FF]/20 text-[#8B35FF] shadow-[0_0_10px_rgba(139,53,255,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="MITRA Password Vault (AES-GCM Encrypted)"
        >
          <KeyRound className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('privacy')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'privacy'
              ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Privacy & Security Shield Center"
        >
          <Shield className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('ai')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'ai'
              ? 'bg-gradient-to-tr from-[#00D9FF] to-[#8B35FF] text-white shadow-[0_0_12px_rgba(0,217,255,0.5)]'
              : 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="MITRA AI Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom action icons */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onOpenDocs}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all"
          title="Architecture, Android Source Code & Build Guide"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTogglePanel('settings')}
          className={`p-2 rounded-xl transition-all ${
            activePanel === 'settings'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Browser Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

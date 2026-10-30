import React, { useState } from 'react';
import { Clock, Search, Trash2, ExternalLink, X, Calendar } from 'lucide-react';
import { HistoryItem } from '../../shared/types';

interface HistoryDrawerProps {
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onNavigate,
  onDeleteHistoryItem,
  onClearAllHistory,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  const filtered = history.filter(
    h => h.title.toLowerCase().includes(search.toLowerCase()) || h.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-[#0B1025] border-r border-slate-800 flex flex-col z-30 select-none shadow-2xl">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Browsing History</h3>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClearAllHistory}
              className="px-2 py-0.5 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              title="Clear all browsing history"
            >
              Clear All
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-2 border-b border-slate-800">
        <div className="flex items-center bg-[#080D24] px-2 py-1.5 rounded-lg border border-slate-700 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No history records found</div>
        ) : (
          filtered.map(h => (
            <div
              key={h.id}
              onClick={() => onNavigate(h.url)}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#0F1738] cursor-pointer text-xs transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="truncate">
                  <div className="text-slate-200 font-medium truncate">{h.title}</div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-2">
                    <span>{new Date(h.visitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="truncate">{h.url}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeleteHistoryItem(h.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                title="Remove from history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

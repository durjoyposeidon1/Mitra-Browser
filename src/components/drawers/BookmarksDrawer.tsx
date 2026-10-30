import React, { useState } from 'react';
import { Bookmark, Folder, Plus, Search, Trash2, ExternalLink, X } from 'lucide-react';
import { Bookmark as BookmarkType } from '../../shared/types';

interface BookmarksDrawerProps {
  bookmarks: BookmarkType[];
  onNavigate: (url: string) => void;
  onAddBookmark: (title: string, url: string) => void;
  onDeleteBookmark: (id: string) => void;
  onClose: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  bookmarks,
  onNavigate,
  onAddBookmark,
  onDeleteBookmark,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const filtered = bookmarks.filter(
    b => b.title.toLowerCase().includes(search.toLowerCase()) || b.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    onAddBookmark(title, url.startsWith('http') ? url : `https://${url}`);
    setTitle('');
    setUrl('');
    setIsAdding(false);
  };

  return (
    <div className="w-80 h-full bg-[#0B1025] border-r border-slate-800 flex flex-col z-30 select-none shadow-2xl">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bookmarks</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Add Bookmark"
          >
            <Plus className="w-4 h-4" />
          </button>
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
            placeholder="Search bookmarks..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-3 bg-[#080D24]/90 border-b border-slate-800 space-y-2 text-xs">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Page title"
            className="w-full bg-[#0B1025] border border-slate-700 rounded p-1.5 text-white"
            required
          />
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL (e.g. https://...)"
            className="w-full bg-[#0B1025] border border-slate-700 rounded p-1.5 text-white"
            required
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#00D9FF] text-black font-semibold rounded hover:bg-cyan-300"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No bookmarks found</div>
        ) : (
          filtered.map(b => (
            <div
              key={b.id}
              onClick={() => onNavigate(b.url)}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#0F1738] cursor-pointer text-xs transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Bookmark className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                <div className="truncate">
                  <div className="text-slate-200 font-medium truncate">{b.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{b.url}</div>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeleteBookmark(b.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                title="Delete Bookmark"
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

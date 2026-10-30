import React from 'react';
import { Download, File, CheckCircle2, Pause, Play, X, Trash2, FolderOpen } from 'lucide-react';
import { DownloadItem } from '../../shared/types';

interface DownloadsDrawerProps {
  downloads: DownloadItem[];
  onCancelDownload: (id: string) => void;
  onClearDownloads: () => void;
  onClose: () => void;
}

export const DownloadsDrawer: React.FC<DownloadsDrawerProps> = ({
  downloads,
  onCancelDownload,
  onClearDownloads,
  onClose,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  return (
    <div className="w-80 h-full bg-[#0B1025] border-r border-slate-800 flex flex-col z-30 select-none shadow-2xl">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Downloads</h3>
        </div>
        <div className="flex items-center gap-1">
          {downloads.length > 0 && (
            <button
              onClick={onClearDownloads}
              className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white rounded"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {downloads.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            <Download className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            No files downloaded in this session
          </div>
        ) : (
          downloads.map(item => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-[#080D24] border border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <File className="w-4 h-4 text-[#00D9FF] shrink-0" />
                  <span className="font-semibold text-slate-200 truncate">{item.filename}</span>
                </div>
                {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>

              {item.status === 'downloading' && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#00D9FF] h-full transition-all duration-300"
                    style={{ width: `${(item.bytesDownloaded / item.fileSize) * 100}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  {formatSize(item.bytesDownloaded)} of {formatSize(item.fileSize)}
                </span>
                <span className="capitalize text-cyan-400 font-medium">{item.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

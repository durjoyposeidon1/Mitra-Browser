import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, AlertTriangle, ExternalLink, ZoomIn, ZoomOut, Search, X } from 'lucide-react';

interface BrowserViewportProps {
  url: string;
  zoomLevel: number;
  isLoading: boolean;
  onNavigate: (url: string) => void;
  onTitleReceived: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onZoomChange: (newZoom: number) => void;
}

export const BrowserViewport: React.FC<BrowserViewportProps> = ({
  url,
  zoomLevel,
  isLoading,
  onNavigate,
  onTitleReceived,
  onLoadingChange,
  onZoomChange,
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [showFindInPage, setShowFindInPage] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset errors on new URL
  useEffect(() => {
    setLoadError(null);
  }, [url]);

  // Handle postMessage events sent from injected script inside the proxy
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && typeof e.data === 'object') {
        if (e.data.type === 'MITRA_NAVIGATE' && e.data.url) {
          onNavigate(e.data.url);
        } else if (e.data.type === 'MITRA_PAGE_LOADED') {
          if (e.data.title) onTitleReceived(e.data.title);
          onLoadingChange(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onTitleReceived, onLoadingChange]);

  // Keyboard shortcut listener (Ctrl+F for Find In Page, Ctrl++ / Ctrl+- for zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowFindInPage(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const proxyUrl = `/api/browser/proxy?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex-1 relative flex flex-col bg-white overflow-hidden">
      {/* Top Thin Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent z-40 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00D9FF] via-[#2864FF] to-[#8B35FF] animate-pulse w-full" />
        </div>
      )}

      {/* Find In Page Overlay */}
      {showFindInPage && (
        <div className="absolute top-3 right-4 z-40 bg-[#0B1025] border border-slate-700 rounded-xl p-2 shadow-2xl flex items-center gap-2 text-xs">
          <Search className="w-4 h-4 text-[#00D9FF]" />
          <input
            type="text"
            value={findQuery}
            onChange={e => setFindQuery(e.target.value)}
            placeholder="Find in page..."
            className="bg-[#080D24] text-white px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-[#00D9FF] w-48 text-xs"
            autoFocus
          />
          <button
            onClick={() => setShowFindInPage(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Real Webpage Viewport */}
      {loadError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#080D24] text-white">
          <div className="max-w-md text-center p-6 rounded-2xl bg-[#0B1025] border border-slate-800">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Webpage Navigation Error</h2>
            <p className="text-xs text-slate-400 mb-6">{loadError}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setLoadError(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#00D9FF] text-black rounded-lg hover:bg-cyan-300"
              >
                Retry Loading
              </button>
              <button
                onClick={() => onNavigate('mitra://home')}
                className="px-4 py-2 text-xs text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={proxyUrl}
          title="MITRA Web Engine"
          className="flex-1 w-full h-full border-none"
          style={{
            zoom: `${zoomLevel}%`,
          }}
          onLoad={() => {
            onLoadingChange(false);
            try {
              // Try to extract page title if same-origin allowed
              const title = iframeRef.current?.contentDocument?.title;
              if (title) onTitleReceived(title);
            } catch {
              // cross-origin restriction handled gracefully via postMessage
            }
          }}
          onError={() => {
            onLoadingChange(false);
            setLoadError('Failed to establish secure tunnel to host.');
          }}
        />
      )}

      {/* Bottom Status & Zoom Bar */}
      <div className="h-6 bg-[#080D24] border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none z-30">
        <div className="truncate max-w-md text-slate-400">
          {hoveredUrl ? hoveredUrl : isLoading ? 'Establishing secure handshake...' : 'Ready'}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
            className="hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-300 text-[10px] w-8 text-center">{zoomLevel}%</span>
          <button
            onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
            className="hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

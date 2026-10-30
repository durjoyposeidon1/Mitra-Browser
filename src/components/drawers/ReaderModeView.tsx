import React, { useState, useEffect } from 'react';
import { BookOpen, X, Type, Clock, Sparkles } from 'lucide-react';

interface ReaderModeViewProps {
  url: string;
  onClose: () => void;
  onOpenAI: () => void;
}

export const ReaderModeView: React.FC<ReaderModeViewProps> = ({ url, onClose, onOpenAI }) => {
  const [data, setData] = useState<{ title: string; excerpt: string; textContent: string; readingTimeMinutes: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/browser/reader?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [url]);

  const themeClasses = {
    dark: 'bg-[#080D24] text-slate-200',
    sepia: 'bg-[#F4ECD8] text-[#433422]',
    light: 'bg-white text-slate-800',
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${themeClasses[theme]}`}>
      {/* Top Reader Controls Bar */}
      <div className="h-11 border-b border-black/10 dark:border-white/10 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs">
          <BookOpen className="w-4 h-4 text-[#00D9FF]" />
          <span className="font-bold">MITRA Reader Mode</span>
          {data && (
            <span className="opacity-70 flex items-center gap-1">
              • <Clock className="w-3 h-3" /> {data.readingTimeMinutes} min read
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`w-5 h-5 rounded-full bg-[#080D24] border ${theme === 'dark' ? 'border-[#00D9FF] scale-110' : 'border-slate-600'}`}
              title="Dark"
            />
            <button
              onClick={() => setTheme('sepia')}
              className={`w-5 h-5 rounded-full bg-[#F4ECD8] border ${theme === 'sepia' ? 'border-[#00D9FF] scale-110' : 'border-slate-400'}`}
              title="Sepia"
            />
            <button
              onClick={() => setTheme('light')}
              className={`w-5 h-5 rounded-full bg-white border ${theme === 'light' ? 'border-[#00D9FF] scale-110' : 'border-slate-300'}`}
              title="Light"
            />
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-0.5 rounded border border-current/20 hover:bg-current/10 font-bold"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="px-2 py-0.5 rounded border border-current/20 hover:bg-current/10 font-bold"
            >
              A+
            </button>
          </div>

          {/* AI action */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Summary
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-current/10 rounded"
            title="Exit Reader Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-10 flex justify-center">
        {loading ? (
          <div className="text-center py-20 text-xs opacity-60">Extracting article content...</div>
        ) : data ? (
          <article className={`max-w-2xl w-full leading-relaxed ${fontClasses[fontFamily]}`} style={{ fontSize: `${fontSize}px` }}>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">{data.title}</h1>
            <div className="text-xs opacity-60 mb-8 pb-4 border-b border-current/20 flex items-center justify-between">
              <span>Source: {new URL(url).hostname}</span>
              <span>Estimated reading time: {data.readingTimeMinutes} mins</span>
            </div>
            <div className="space-y-4 whitespace-pre-line text-justify leading-relaxed">
              {data.textContent}
            </div>
          </article>
        ) : (
          <div className="text-center py-20 text-xs opacity-60">Unable to generate reader mode for this page.</div>
        )}
      </div>
    </div>
  );
};

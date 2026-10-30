import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  FileText,
  HelpCircle,
  Languages,
  Check,
  Copy,
  Trash2,
  ListCollapse,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { MitraAIMessage } from '../shared/types';
import { OFFICIAL_BRAND } from '../shared/defaults';

interface MitraAIPanelProps {
  isOpen: boolean;
  currentUrl: string;
  onClose: () => void;
}

export const MitraAIPanel: React.FC<MitraAIPanelProps> = ({ isOpen, currentUrl, onClose }) => {
  const [messages, setMessages] = useState<MitraAIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **MITRA AI**, your intelligent browser assistant powered by Gemini.

I can help you:
- **Summarize** the current webpage in seconds
- **Explain** technical terms or complex ideas
- **Answer questions** directly from the page content
- **Translate** foreign articles or text
- **Extract** key research takeaways

Select a quick action below or type your question.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = async (promptText: string, actionType?: MitraAIMessage['actionType']) => {
    if (!promptText.trim() && !actionType) return;

    const userMessage: MitraAIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText || (actionType ? `Action: ${actionType.toUpperCase()}` : ''),
      timestamp: Date.now(),
      actionType,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Fetch webpage content from reader endpoint
      let pageContent = '';
      if (currentUrl && currentUrl !== 'mitra://home') {
        try {
          const readerRes = await fetch(`/api/browser/reader?url=${encodeURIComponent(currentUrl)}`);
          if (readerRes.ok) {
            const readerData = await readerRes.json();
            pageContent = readerData.textContent || '';
          }
        } catch {
          // fallback gracefully
        }
      }

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          action: actionType || 'qa',
          pageUrl: currentUrl,
          pageContent,
        }),
      });

      const data = await res.json();

      const aiMessage: MitraAIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.error || 'No response from MITRA AI.',
        timestamp: Date.now(),
        actionType,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: unknown) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error contacting MITRA AI server: ${err instanceof Error ? err.message : 'Network error'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Conversation cleared. How can I assist you with this webpage?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="w-80 sm:w-96 h-full bg-[#0B1025] border-l border-slate-800 flex flex-col z-30 shadow-2xl relative">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00D9FF] to-[#8B35FF] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>MITRA AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] font-mono">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">In-Browser Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Page Context Badge */}
      <div className="px-3 py-1.5 bg-[#0F1738]/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
        <span className="truncate max-w-[220px] text-slate-400">
          Context: {currentUrl === 'mitra://home' ? 'Home Dashboard' : currentUrl}
        </span>
        <span className="text-emerald-400 font-semibold text-[10px]">Active</span>
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 border-b border-slate-800/80 bg-[#080D24]/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => handleSendMessage('Summarize this webpage with key insights', 'summarize')}
          disabled={isLoading || currentUrl === 'mitra://home'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B1025] border border-slate-700 hover:border-[#00D9FF] text-slate-300 hover:text-white shrink-0 disabled:opacity-40 text-[11px] transition-all"
        >
          <ListCollapse className="w-3 h-3 text-[#00D9FF]" />
          <span>Summarize</span>
        </button>

        <button
          onClick={() => handleSendMessage('Extract top research takeaways and facts', 'research')}
          disabled={isLoading || currentUrl === 'mitra://home'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B1025] border border-slate-700 hover:border-[#8B35FF] text-slate-300 hover:text-white shrink-0 disabled:opacity-40 text-[11px] transition-all"
        >
          <Lightbulb className="w-3 h-3 text-[#8B35FF]" />
          <span>Key Points</span>
        </button>

        <button
          onClick={() => handleSendMessage('Translate this webpage content into English', 'translate')}
          disabled={isLoading || currentUrl === 'mitra://home'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B1025] border border-slate-700 hover:border-[#2864FF] text-slate-300 hover:text-white shrink-0 disabled:opacity-40 text-[11px] transition-all"
        >
          <Languages className="w-3 h-3 text-[#2864FF]" />
          <span>Translate</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#00D9FF] to-[#2864FF] text-black font-medium shadow-md'
                  : 'bg-[#080D24] text-slate-200 border border-slate-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.role === 'assistant' && (
                <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-white flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#080D24] border border-slate-800 rounded-2xl text-xs text-cyan-300 max-w-[80%]">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00D9FF]" />
            <span>MITRA AI is analyzing page content...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-800 bg-[#080D24]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputPrompt);
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder="Ask MITRA AI about this page..."
            className="flex-1 bg-[#0B1025] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2 bg-gradient-to-r from-[#00D9FF] to-[#2864FF] text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[9px] text-slate-500 text-center mt-1.5">
          AI generated content • Webpage content treated as untrusted input
        </p>
      </div>
    </div>
  );
};

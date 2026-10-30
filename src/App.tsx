import React, { useState, useEffect } from 'react';
import { HeaderTabBar } from './components/HeaderTabBar';
import { AddressBar } from './components/AddressBar';
import { Sidebar } from './components/Sidebar';
import { BrowserViewport } from './components/BrowserViewport';
import { MitraHomepage } from './components/MitraHomepage';
import { MitraAIPanel } from './components/MitraAIPanel';
import { AndroidEmulatorView } from './components/AndroidEmulatorView';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';

import { BookmarksDrawer } from './components/drawers/BookmarksDrawer';
import { HistoryDrawer } from './components/drawers/HistoryDrawer';
import { DownloadsDrawer } from './components/drawers/DownloadsDrawer';
import { PasswordVaultModal } from './components/drawers/PasswordVaultModal';
import { PrivacyCenterModal } from './components/drawers/PrivacyCenterModal';
import { SettingsModal } from './components/drawers/SettingsModal';
import { ReaderModeView } from './components/drawers/ReaderModeView';

import { Tab, TabGroup, Bookmark, HistoryItem, DownloadItem, BrowserSettings, PrivacyStats } from './shared/types';
import { DEFAULT_BOOKMARKS, DEFAULT_SETTINGS, DEFAULT_TAB_GROUPS } from './shared/defaults';

export default function App() {
  // Navigation & Tabs State
  const [tabs, setTabs] = useState<Tab[]>(() => {
    return [
      {
        id: 'tab-1',
        title: 'MITRA Home',
        url: 'mitra://home',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isPinned: false,
        isIncognito: false,
        zoomLevel: 100,
        historyStack: ['mitra://home'],
        historyIndex: 0,
      },
      {
        id: 'tab-2',
        title: 'Wikipedia - Main Page',
        url: 'https://en.wikipedia.org/wiki/Main_Page',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isPinned: false,
        isIncognito: false,
        zoomLevel: 100,
        historyStack: ['https://en.wikipedia.org/wiki/Main_Page'],
        historyIndex: 0,
      },
    ];
  });
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [tabGroups, setTabGroups] = useState<TabGroup[]>(DEFAULT_TAB_GROUPS);

  // Platform Mode ('desktop' | 'android' | 'architecture')
  const [platformMode, setPlatformMode] = useState<'desktop' | 'android' | 'architecture'>('desktop');

  // Drawers and Panels
  const [activeDrawer, setActiveDrawer] = useState<'bookmarks' | 'history' | 'downloads' | 'vault' | 'privacy' | 'settings' | 'ai' | null>(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isReaderModeActive, setIsReaderModeActive] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Bookmarks, History & Downloads State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('mitra_bookmarks');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('mitra_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Wikipedia - Main Page', url: 'https://en.wikipedia.org/wiki/Main_Page', visitTime: Date.now() - 3600000, visitCount: 1 },
      { id: '2', title: 'Hacker News', url: 'https://news.ycombinator.com', visitTime: Date.now() - 7200000, visitCount: 2 },
    ];
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: 'dl-1',
      filename: 'mitra_browser_setup.exe',
      url: 'https://mitra.internal/bin/mitra.exe',
      fileSize: 84200000,
      bytesDownloaded: 84200000,
      status: 'completed',
      startTime: Date.now() - 600000,
      path: 'C:\\Users\\User\\Downloads\\Mitra\\mitra_browser_setup.exe',
    },
  ]);

  // Privacy Telemetry Stats
  const [privacyStats, setPrivacyStats] = useState<PrivacyStats>({
    adsBlockedTotal: 48,
    trackersBlockedTotal: 124,
    bandwidthSavedBytes: 14200000,
    httpsUpgrades: 32,
  });

  // Settings
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    const saved = localStorage.getItem('mitra_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Fetch telemetry stats from server periodically
  useEffect(() => {
    fetch('/api/browser/adblock/stats')
      .then(res => res.json())
      .then(stats => setPrivacyStats(stats))
      .catch(() => {});
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          handleNewTab();
        } else if (e.key.toLowerCase() === 'w') {
          e.preventDefault();
          handleCloseTab(activeTabId);
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          handleToggleDrawer('history');
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleToggleDrawer('bookmarks');
        } else if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          handleToggleDrawer('downloads');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Navigation logic
  const handleNavigate = (url: string) => {
    let finalUrl = url.trim();

    // Reset reader mode on navigation
    setIsReaderModeActive(false);

    setTabs(prev =>
      prev.map(tab => {
        if (tab.id === activeTabId) {
          const newStack = tab.historyStack.slice(0, tab.historyIndex + 1);
          newStack.push(finalUrl);

          return {
            ...tab,
            url: finalUrl,
            isLoading: finalUrl !== 'mitra://home',
            historyStack: newStack,
            historyIndex: newStack.length - 1,
            canGoBack: newStack.length > 1,
            canGoForward: false,
          };
        }
        return tab;
      })
    );

    // Record in history if not internal or incognito
    if (finalUrl !== 'mitra://home' && !activeTab.isIncognito) {
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        title: finalUrl,
        url: finalUrl,
        visitTime: Date.now(),
        visitCount: 1,
      };
      setHistory(prev => {
        const updated = [newHistoryItem, ...prev];
        localStorage.setItem('mitra_history', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleNewTab = (url = 'mitra://home') => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: url === 'mitra://home' ? 'MITRA Home' : url,
      url,
      isLoading: url !== 'mitra://home',
      canGoBack: false,
      canGoForward: false,
      isPinned: false,
      isIncognito: false,
      zoomLevel: 100,
      historyStack: [url],
      historyIndex: 0,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setIsReaderModeActive(false);
  };

  const handleCloseTab = (id: string) => {
    const remaining = tabs.filter(t => t.id !== id);
    if (remaining.length === 0) {
      handleNewTab('mitra://home');
    } else {
      setTabs(remaining);
      if (activeTabId === id) {
        setActiveTabId(remaining[remaining.length - 1].id);
      }
    }
  };

  const handleTogglePinTab = (id: string) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, isPinned: !t.isPinned } : t)));
  };

  const handleToggleMuteTab = (id: string) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, audioMuted: !t.audioMuted } : t)));
  };

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.historyStack[prevIndex];
      setTabs(prev =>
        prev.map(t =>
          t.id === activeTabId
            ? {
                ...t,
                url: prevUrl,
                historyIndex: prevIndex,
                canGoBack: prevIndex > 0,
                canGoForward: true,
              }
            : t
        )
      );
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.historyStack.length - 1) {
      const nextIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.historyStack[nextIndex];
      setTabs(prev =>
        prev.map(t =>
          t.id === activeTabId
            ? {
                ...t,
                url: nextUrl,
                historyIndex: nextIndex,
                canGoBack: true,
                canGoForward: nextIndex < activeTab.historyStack.length - 1,
              }
            : t
        )
      );
    }
  };

  const handleReload = () => {
    const currentUrl = activeTab.url;
    setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, isLoading: true } : t)));
    // force iframe reload or re-navigate
    handleNavigate(currentUrl);
  };

  const handleGoHome = () => {
    handleNavigate('mitra://home');
  };

  const handleToggleBookmark = () => {
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    if (isBookmarked) {
      const updated = bookmarks.filter(b => b.url !== activeTab.url);
      setBookmarks(updated);
      localStorage.setItem('mitra_bookmarks', JSON.stringify(updated));
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        createdAt: Date.now(),
      };
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      localStorage.setItem('mitra_bookmarks', JSON.stringify(updated));
    }
  };

  const handleAddBookmark = (title: string, url: string) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url,
      createdAt: Date.now(),
    };
    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    localStorage.setItem('mitra_bookmarks', JSON.stringify(updated));
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('mitra_bookmarks', JSON.stringify(updated));
  };

  const handleZoomChange = (newZoom: number) => {
    setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, zoomLevel: newZoom } : t)));
  };

  const handleToggleDrawer = (drawer: 'bookmarks' | 'history' | 'downloads' | 'vault' | 'privacy' | 'settings' | 'ai') => {
    if (drawer === 'ai') {
      setIsAIPanelOpen(!isAIPanelOpen);
      return;
    }
    setActiveDrawer(activeDrawer === drawer ? null : drawer);
  };

  const handleClearBrowsingData = () => {
    setHistory([]);
    localStorage.removeItem('mitra_history');
    setPrivacyStats(prev => ({ ...prev, adsBlockedTotal: 0, trackersBlockedTotal: 0 }));
  };

  const isCurrentBookmarked = bookmarks.some(b => b.url === activeTab.url);
  const isWebPage = activeTab.url !== 'mitra://home';

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080D24] text-white select-none overflow-hidden">
      {/* Top Desktop Tabs Bar */}
      <HeaderTabBar
        tabs={tabs}
        activeTabId={activeTabId}
        tabGroups={tabGroups}
        platformMode={platformMode}
        onSelectTab={setActiveTabId}
        onNewTab={() => handleNewTab('mitra://home')}
        onCloseTab={handleCloseTab}
        onTogglePinTab={handleTogglePinTab}
        onToggleMuteTab={handleToggleMuteTab}
        onSetPlatformMode={setPlatformMode}
      />

      {/* Mode View Routing */}
      {platformMode === 'android' ? (
        /* Native Android Kotlin Experience */
        <AndroidEmulatorView
          privacyStats={privacyStats}
          onOpenPrivacyCenter={() => setActiveDrawer('privacy')}
          onOpenSettings={() => setActiveDrawer('settings')}
          onOpenAI={() => setIsAIPanelOpen(true)}
        />
      ) : platformMode === 'architecture' ? (
        /* Architecture & Source Hub directly */
        <div className="flex-1 bg-[#080D24] flex items-center justify-center p-6">
          <div className="text-center max-w-lg p-8 rounded-3xl bg-[#0B1025] border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-2">MITRA Source & Architecture Hub</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Explore the complete multi-platform repository architecture, Electron Chromium setup, Native Kotlin Android project, Room schemas, and APK/AAB build instructions.
            </p>
            <button
              onClick={() => setShowDocsModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#00D9FF] to-[#2864FF] text-black font-bold rounded-xl shadow-lg hover:opacity-90 transition-all text-xs"
            >
              Open Technical Blueprints & Source Code
            </button>
          </div>
        </div>
      ) : (
        /* Desktop Chromium Experience */
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Smart Omnibox Address Bar */}
          <AddressBar
            currentUrl={activeTab.url}
            canGoBack={activeTab.canGoBack}
            canGoForward={activeTab.canGoForward}
            isLoading={activeTab.isLoading}
            isBookmarked={isCurrentBookmarked}
            adsBlockedCount={privacyStats.adsBlockedTotal}
            readerModeAvailable={isWebPage}
            isReaderModeActive={isReaderModeActive}
            isAIPanelOpen={isAIPanelOpen}
            onNavigate={handleNavigate}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onReload={handleReload}
            onGoHome={handleGoHome}
            onToggleBookmark={handleToggleBookmark}
            onToggleReaderMode={() => setIsReaderModeActive(!isReaderModeActive)}
            onToggleAIPanel={() => setIsAIPanelOpen(!isAIPanelOpen)}
            onOpenDownloads={() => setActiveDrawer('downloads')}
            onOpenPrivacyCenter={() => setActiveDrawer('privacy')}
          />

          {/* Main Body with Sidebar, Viewport & Panels */}
          <div className="flex flex-1 overflow-hidden relative">
            {/* Left Thin Sidebar */}
            <Sidebar
              activePanel={activeDrawer}
              onTogglePanel={handleToggleDrawer}
              onOpenDocs={() => setShowDocsModal(true)}
            />

            {/* Left Drawers (Bookmarks, History, Downloads) */}
            {activeDrawer === 'bookmarks' && (
              <BookmarksDrawer
                bookmarks={bookmarks}
                onNavigate={handleNavigate}
                onAddBookmark={handleAddBookmark}
                onDeleteBookmark={handleDeleteBookmark}
                onClose={() => setActiveDrawer(null)}
              />
            )}

            {activeDrawer === 'history' && (
              <HistoryDrawer
                history={history}
                onNavigate={handleNavigate}
                onDeleteHistoryItem={id => {
                  const updated = history.filter(h => h.id !== id);
                  setHistory(updated);
                  localStorage.setItem('mitra_history', JSON.stringify(updated));
                }}
                onClearAllHistory={handleClearBrowsingData}
                onClose={() => setActiveDrawer(null)}
              />
            )}

            {activeDrawer === 'downloads' && (
              <DownloadsDrawer
                downloads={downloads}
                onCancelDownload={id => {
                  setDownloads(prev => prev.map(d => (d.id === id ? { ...d, status: 'cancelled' } : d)));
                }}
                onClearDownloads={() => setDownloads([])}
                onClose={() => setActiveDrawer(null)}
              />
            )}

            {/* Main Central Viewport */}
            {isReaderModeActive && isWebPage ? (
              <ReaderModeView
                url={activeTab.url}
                onClose={() => setIsReaderModeActive(false)}
                onOpenAI={() => setIsAIPanelOpen(true)}
              />
            ) : activeTab.url === 'mitra://home' ? (
              <MitraHomepage
                onNavigate={handleNavigate}
                privacyStats={privacyStats}
                onOpenPrivacyCenter={() => setActiveDrawer('privacy')}
                onOpenAI={() => setIsAIPanelOpen(true)}
              />
            ) : (
              <BrowserViewport
                url={activeTab.url}
                zoomLevel={activeTab.zoomLevel}
                isLoading={activeTab.isLoading}
                onNavigate={handleNavigate}
                onTitleReceived={title => {
                  setTabs(prev =>
                    prev.map(t => (t.id === activeTabId ? { ...t, title, isLoading: false } : t))
                  );
                }}
                onLoadingChange={loading => {
                  setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, isLoading: loading } : t)));
                }}
                onZoomChange={handleZoomChange}
              />
            )}

            {/* Right Slide-over MITRA AI Copilot Panel */}
            <MitraAIPanel
              isOpen={isAIPanelOpen}
              currentUrl={activeTab.url}
              onClose={() => setIsAIPanelOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Modal Windows */}
      <PasswordVaultModal
        isOpen={activeDrawer === 'vault'}
        onClose={() => setActiveDrawer(null)}
      />

      <PrivacyCenterModal
        isOpen={activeDrawer === 'privacy'}
        privacyStats={privacyStats}
        settings={settings}
        onUpdateSettings={newS => {
          const updated = { ...settings, ...newS };
          setSettings(updated);
          localStorage.setItem('mitra_settings', JSON.stringify(updated));
        }}
        onClearBrowsingData={handleClearBrowsingData}
        onClose={() => setActiveDrawer(null)}
      />

      <SettingsModal
        isOpen={activeDrawer === 'settings'}
        settings={settings}
        onUpdateSettings={newS => {
          const updated = { ...settings, ...newS };
          setSettings(updated);
          localStorage.setItem('mitra_settings', JSON.stringify(updated));
        }}
        onClose={() => setActiveDrawer(null)}
      />

      <ArchitectureDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
}

/**
 * MITRA BROWSER Shared Architecture & Types
 * Shared across Desktop (Electron/Chromium), Android (Kotlin/Room), and Web Engine.
 * Official Brand: MITRA BROWSER - Browse Beyond Limits.
 */

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isPinned: boolean;
  isIncognito: boolean;
  groupId?: string;
  zoomLevel: number; // 100 default (50 - 200)
  audioPlaying?: boolean;
  audioMuted?: boolean;
  historyStack: string[];
  historyIndex: number;
}

export interface TabGroup {
  id: string;
  title: string;
  color: string; // Hex color (cyan, blue, purple, magenta)
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  createdAt: number;
}

export interface BookmarkFolder {
  id: string;
  title: string;
  parentId?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitTime: number;
  visitCount: number;
  favicon?: string;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  fileSize: number; // bytes
  bytesDownloaded: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed' | 'cancelled';
  startTime: number;
  completedTime?: number;
  path: string;
  mimeType?: string;
}

export interface PasswordVaultItem {
  id: string;
  domain: string;
  username: string;
  encryptedPassword: string; // Base64 ciphertext
  iv: string; // Base64 init vector
  title?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SearchEngineOption {
  id: 'google' | 'bing' | 'duckduckgo' | 'brave' | 'custom';
  name: string;
  searchUrl: string;
  iconName: string;
}

export interface BrowserSettings {
  defaultSearchEngine: 'google' | 'bing' | 'duckduckgo' | 'brave' | 'custom';
  customSearchUrl: string;
  adBlockerEnabled: boolean;
  trackerProtectionLevel: 'standard' | 'strict' | 'custom';
  httpsOnlyMode: boolean;
  doNotTrack: boolean;
  thirdPartyCookiesBlocked: boolean;
  theme: 'dark' | 'light' | 'system';
  startupBehavior: 'newtab' | 'restore' | 'custom';
  customStartupUrl: string;
  showBookmarksToolbar: boolean;
  hardwareAcceleration: boolean;
  downloadPath: string;
  aiAssistantEnabled: boolean;
  defaultZoom: number;
  readerFont: 'sans' | 'serif' | 'mono';
  readerFontSize: number;
  readerTheme: 'dark' | 'sepia' | 'light';
}

export interface PrivacyStats {
  adsBlockedTotal: number;
  trackersBlockedTotal: number;
  bandwidthSavedBytes: number;
  httpsUpgrades: number;
}

export interface SecurityReport {
  protocol: 'https' | 'http' | 'mitra';
  isSecure: boolean;
  host: string;
  tlsVersion: string;
  cipherSuite: string;
  certificateIssuer: string;
  certificateValidUntil: string;
  permissions: {
    camera: 'allow' | 'block' | 'ask';
    microphone: 'allow' | 'block' | 'ask';
    location: 'allow' | 'block' | 'ask';
    notifications: 'allow' | 'block' | 'ask';
  };
  securityScore: 'A+' | 'A' | 'B' | 'Insecure';
}

export interface MitraAIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  actionType?: 'summarize' | 'explain' | 'qa' | 'translate' | 'research' | 'notes';
}

export interface QuickShortcut {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
}

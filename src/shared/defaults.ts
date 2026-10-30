import { Bookmark, BrowserSettings, QuickShortcut, TabGroup } from './types';

export const OFFICIAL_BRAND = {
  name: 'MITRA BROWSER',
  tagline: 'Browse Beyond Limits.',
  logoUrl: '/assets/aistudio/DC8AA799-D888-435F-88AA-C96C78B1D4BE_af42d682.png',
  colors: {
    navy: '#080D24',
    dark: '#0B1025',
    cyan: '#00D9FF',
    blue: '#2864FF',
    purple: '#8B35FF',
    magenta: '#C735E8',
    white: '#FFFFFF',
  },
  version: '1.2.0-Production',
  engineVersion: 'Chromium 134.0.6998.35 / Gecko-Vite',
};

export const DEFAULT_SHORTCUTS: QuickShortcut[] = [
  { id: '1', title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', color: '#FFFFFF' },
  { id: '2', title: 'Google', url: 'https://www.google.com', color: '#4285F4' },
  { id: '3', title: 'GitHub', url: 'https://github.com', color: '#8B35FF' },
  { id: '4', title: 'Hacker News', url: 'https://news.ycombinator.com', color: '#FF6600' },
  { id: '5', title: 'DuckDuckGo', url: 'https://duckduckgo.com', color: '#DE5833' },
  { id: '6', title: 'Reddit', url: 'https://reddit.com', color: '#FF4500' },
  { id: '7', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', color: '#00D9FF' },
  { id: '8', title: 'YouTube', url: 'https://www.youtube.com', color: '#FF0000' },
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    title: 'MITRA BROWSER Official Portal',
    url: 'https://mitra-browser.internal',
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'bm-2',
    title: 'Wikipedia - Web Browser History',
    url: 'https://en.wikipedia.org/wiki/History_of_the_web_browser',
    createdAt: Date.now() - 900000,
  },
  {
    id: 'bm-3',
    title: 'GitHub - Open Source Software',
    url: 'https://github.com',
    createdAt: Date.now() - 800000,
  },
  {
    id: 'bm-4',
    title: 'W3C Web Standards',
    url: 'https://www.w3.org',
    createdAt: Date.now() - 700000,
  },
  {
    id: 'bm-5',
    title: 'DuckDuckGo Search',
    url: 'https://duckduckgo.com',
    createdAt: Date.now() - 600000,
  },
];

export const DEFAULT_TAB_GROUPS: TabGroup[] = [
  { id: 'grp-work', title: 'Research & Dev', color: '#00D9FF' },
  { id: 'grp-media', title: 'Daily Reads', color: '#8B35FF' },
];

export const DEFAULT_SETTINGS: BrowserSettings = {
  defaultSearchEngine: 'google',
  customSearchUrl: 'https://www.google.com/search?q=',
  adBlockerEnabled: true,
  trackerProtectionLevel: 'strict',
  httpsOnlyMode: true,
  doNotTrack: true,
  thirdPartyCookiesBlocked: true,
  theme: 'dark',
  startupBehavior: 'newtab',
  customStartupUrl: 'https://en.wikipedia.org',
  showBookmarksToolbar: true,
  hardwareAcceleration: true,
  downloadPath: 'C:\\Users\\User\\Downloads\\Mitra',
  aiAssistantEnabled: true,
  defaultZoom: 100,
  readerFont: 'sans',
  readerFontSize: 18,
  readerTheme: 'dark',
};

export const TRACKER_BLOCKLIST_DOMAINS = [
  'google-analytics.com',
  'googletagmanager.com',
  'doubleclick.net',
  'googlesyndication.com',
  'adservice.google.com',
  'criteo.com',
  'criteo.net',
  'taboola.com',
  'outbrain.com',
  'adnxs.com',
  'rubiconproject.com',
  'pubmatic.com',
  'openx.net',
  'casalemedia.com',
  'advertising.com',
  'scorecardresearch.com',
  'quantserve.com',
  'hotjar.com',
  'segment.io',
  'mixpanel.com',
  'newrelic.com',
  'sentry.io',
  'facebook.net/signals',
  'connect.facebook.net/en_US/fbevents.js',
  'ads-twitter.com',
  'analytics.twitter.com',
  'amazon-adsystem.com',
  'moatads.com',
  'adroll.com',
  'smartadserver.com',
  'bingads.microsoft.com',
  'bat.bing.com',
  'media.net',
  'yandex.ru/metrika',
  'clicky.com',
];

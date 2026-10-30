import { app, BrowserWindow, ipcMain, shell, safeStorage, session } from 'electron';
import path from 'path';

/**
 * MITRA BROWSER Desktop Main Process
 * Platform: Windows 10/11, macOS, Linux
 * Architecture: Electron + Bundled Chromium + Secure IPC + safeStorage
 */

let mainWindow: BrowserWindow | null = null;

const AD_BLOCK_DOMAINS = [
  'google-analytics.com',
  'doubleclick.net',
  'googlesyndication.com',
  'criteo.com',
  'outbrain.com',
  'taboola.com',
  'scorecardresearch.com',
  'adroll.com',
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'MITRA BROWSER',
    icon: path.join(__dirname, '../public/assets/aistudio/DC8AA799-D888-435F-88AA-C96C78B1D4BE_af42d682.png'),
    backgroundColor: '#080D24',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#080D24',
      symbolColor: '#00D9FF',
      height: 40,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Content Filtering (Network Ad & Tracker Interception)
  const defaultSession = session.defaultSession;
  defaultSession.webRequest.onBeforeRequest(
    { urls: ['*://*/*'] },
    (details, callback) => {
      const url = details.url.toLowerCase();
      const shouldBlock = AD_BLOCK_DOMAINS.some(domain => url.includes(domain));
      if (shouldBlock) {
        callback({ cancel: true });
      } else {
        callback({ cancel: false });
      }
    }
  );

  // Security: Restrict new-window navigations and open external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      mainWindow?.webContents.send('mitra:create-tab', url);
      return { action: 'deny' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load app (dev or production bundle)
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL(devServerUrl);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('mitra:get-app-info', () => {
  return {
    name: 'MITRA BROWSER',
    tagline: 'Browse Beyond Limits.',
    version: app.getVersion(),
    chromiumVersion: process.versions.chrome,
    electronVersion: process.versions.electron,
    platform: process.platform,
    isSafeStorageAvailable: safeStorage.isEncryptionAvailable(),
  };
});

// Secure SafeStorage IPC for passwords
ipcMain.handle('mitra:encrypt-string', (_event, plaintext: string) => {
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(plaintext);
    return encrypted.toString('base64');
  }
  throw new Error('safeStorage is not available on this platform.');
});

ipcMain.handle('mitra:decrypt-string', (_event, encryptedBase64: string) => {
  if (safeStorage.isEncryptionAvailable()) {
    const buffer = Buffer.from(encryptedBase64, 'base64');
    return safeStorage.decryptString(buffer);
  }
  throw new Error('safeStorage is not available on this platform.');
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

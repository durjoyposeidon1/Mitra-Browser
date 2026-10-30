import { contextBridge, ipcRenderer } from 'electron';

/**
 * MITRA BROWSER Preload Script
 * Context Isolation: true
 * Exposes strictly validated APIs under window.mitraNative
 */

contextBridge.exposeInMainWorld('mitraNative', {
  isElectron: true,
  getAppInfo: () => ipcRenderer.invoke('mitra:get-app-info'),
  encryptString: (plaintext: string) => ipcRenderer.invoke('mitra:encrypt-string', plaintext),
  decryptString: (encryptedBase64: string) => ipcRenderer.invoke('mitra:decrypt-string', encryptedBase64),
  onNewTabRequested: (callback: (url: string) => void) => {
    ipcRenderer.on('mitra:create-tab', (_event, url) => callback(url));
  },
});

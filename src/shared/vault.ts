/**
 * MITRA BROWSER Cryptographic Password Vault
 * Uses Web Crypto API AES-GCM 256-bit with PBKDF2 derived keys.
 * Never stores plain text passwords.
 */

export class MitraVaultEngine {
  private static async deriveKey(masterPassphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(masterPassphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(password: string, masterKey: string): Promise<{ ciphertext: string; iv: string; salt: string }> {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(masterKey, salt);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(password)
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv)),
      salt: btoa(String.fromCharCode(...salt)),
    };
  }

  static async decrypt(ciphertextBase64: string, ivBase64: string, saltBase64: string, masterKey: string): Promise<string> {
    try {
      const dec = new TextDecoder();
      const salt = new Uint8Array(atob(saltBase64).split('').map(c => c.charCodeAt(0)));
      const iv = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)));
      const ciphertext = new Uint8Array(atob(ciphertextBase64).split('').map(c => c.charCodeAt(0)));

      const key = await this.deriveKey(masterKey, salt);
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      return dec.decode(decryptedBuffer);
    } catch {
      throw new Error('Invalid master passphrase or corrupted vault record.');
    }
  }

  static generateStrongPassword(length = 16, includeSymbols = true): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const all = includeSymbols ? chars + symbols : chars;
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, x => all[x % all.length]).join('');
  }
}

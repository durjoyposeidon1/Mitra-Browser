import React, { useState, useEffect } from 'react';
import { KeyRound, Lock, Unlock, Eye, EyeOff, Plus, Trash2, Copy, Check, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { MitraVaultEngine } from '../../shared/vault';
import { PasswordVaultItem } from '../../shared/types';

interface PasswordVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordVaultModal: React.FC<PasswordVaultModalProps> = ({ isOpen, onClose }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPass, setMasterPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [vaultItems, setVaultItems] = useState<PasswordVaultItem[]>(() => {
    const saved = localStorage.getItem('mitra_vault_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Adding new credential state
  const [isAdding, setIsAdding] = useState(false);
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Decrypted cache for currently revealed items
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPass.length < 6) {
      setErrorMsg('Master passphrase must be at least 6 characters.');
      return;
    }
    setErrorMsg('');
    setIsUnlocked(true);
  };

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!site || !username || !password) return;

    try {
      const encrypted = await MitraVaultEngine.encrypt(password, masterPass);
      const newItem: PasswordVaultItem = {
        id: Date.now().toString(),
        domain: site,
        username,
        encryptedPassword: encrypted.ciphertext,
        iv: encrypted.iv,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // store salt alongside iv in composite or storage
      localStorage.setItem(`mitra_salt_${newItem.id}`, encrypted.salt);

      const updated = [...vaultItems, newItem];
      setVaultItems(updated);
      localStorage.setItem('mitra_vault_items', JSON.stringify(updated));

      setSite('');
      setUsername('');
      setPassword('');
      setIsAdding(false);
    } catch {
      setErrorMsg('Failed to encrypt credential.');
    }
  };

  const handleReveal = async (item: PasswordVaultItem) => {
    if (revealedPasswords[item.id]) {
      const copy = { ...revealedPasswords };
      delete copy[item.id];
      setRevealedPasswords(copy);
      return;
    }

    try {
      const salt = localStorage.getItem(`mitra_salt_${item.id}`) || '';
      const decrypted = await MitraVaultEngine.decrypt(item.encryptedPassword, item.iv, salt, masterPass);
      setRevealedPasswords(prev => ({ ...prev, [item.id]: decrypted }));
    } catch {
      alert('Could not decrypt password. Vault passphrase mismatch.');
    }
  };

  const handleCopyPassword = async (item: PasswordVaultItem) => {
    try {
      let pwd = revealedPasswords[item.id];
      if (!pwd) {
        const salt = localStorage.getItem(`mitra_salt_${item.id}`) || '';
        pwd = await MitraVaultEngine.decrypt(item.encryptedPassword, item.iv, salt, masterPass);
      }
      navigator.clipboard.writeText(pwd);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('Decryption failed.');
    }
  };

  const handleDelete = (id: string) => {
    const updated = vaultItems.filter(v => v.id !== id);
    setVaultItems(updated);
    localStorage.setItem('mitra_vault_items', JSON.stringify(updated));
    localStorage.removeItem(`mitra_salt_${id}`);
  };

  const handleGeneratePassword = () => {
    const generated = MitraVaultEngine.generateStrongPassword(18);
    setPassword(generated);
    setShowPassword(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1025] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080D24]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B35FF]/20 flex items-center justify-center text-[#8B35FF]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MITRA Security Vault</h3>
              <p className="text-[10px] text-slate-400">Zero-Knowledge AES-GCM 256-Bit Cryptography</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isUnlocked ? (
          /* Vault Locked State */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#080D24] border border-slate-700 flex items-center justify-center mx-auto text-[#00D9FF] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-1">Enter Master Passphrase</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                All credentials in MITRA Browser are encrypted locally using PBKDF2 and AES-256-GCM.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="max-w-xs mx-auto space-y-3">
              <input
                type="password"
                value={masterPass}
                onChange={e => setMasterPass(e.target.value)}
                placeholder="Master Passphrase (min 6 chars)"
                className="w-full bg-[#080D24] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D9FF] text-center"
                autoFocus
              />

              {errorMsg && <p className="text-rose-400 text-[11px]">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-[#00D9FF] to-[#2864FF] text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Unlock Vault
              </button>
            </form>
          </div>
        ) : (
          /* Vault Unlocked State */
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <Unlock className="w-3.5 h-3.5" />
                <span>Vault Active ({vaultItems.length} stored logins)</span>
              </div>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#8B35FF]/20 text-[#8B35FF] hover:bg-[#8B35FF]/30 rounded-lg font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Login
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleAddCredential} className="p-3 bg-[#080D24] border border-slate-700 rounded-xl space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Website Domain</label>
                  <input
                    type="text"
                    value={site}
                    onChange={e => setSite(e.target.value)}
                    placeholder="e.g. github.com"
                    className="w-full bg-[#0B1025] border border-slate-700 rounded p-1.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Username or Email</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. dev@mitra.io"
                    className="w-full bg-[#0B1025] border border-slate-700 rounded p-1.5 text-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] text-slate-400">Password</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Generate Strong
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#0B1025] border border-slate-700 rounded p-1.5 pr-8 text-white font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-[#8B35FF] text-white font-semibold rounded hover:bg-purple-600"
                  >
                    Encrypt & Save
                  </button>
                </div>
              </form>
            )}

            <div className="max-h-60 overflow-y-auto space-y-2">
              {vaultItems.length === 0 ? (
                <div className="text-center py-6 text-slate-500">No passwords stored in vault.</div>
              ) : (
                vaultItems.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#080D24] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{item.domain}</div>
                      <div className="text-slate-400 text-[11px]">{item.username}</div>
                      <div className="font-mono text-[11px] text-cyan-400 mt-1">
                        {revealedPasswords[item.id] || '••••••••••••••••'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleReveal(item)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        title={revealedPasswords[item.id] ? 'Hide' : 'Reveal'}
                      >
                        {revealedPasswords[item.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopyPassword(item)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        title="Copy Password"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              <span>Encrypted via WebCrypto API</span>
              <button
                onClick={() => setIsUnlocked(false)}
                className="text-cyan-400 hover:underline"
              >
                Lock Vault Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

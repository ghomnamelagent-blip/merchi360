import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { MirchiLogo } from './MirchiLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ADMIN_PASSWORD_STORAGE_KEY = 'mirchi360_admin_password';
export const DEFAULT_ADMIN_PASSWORD = '360merchiadmin';

export const getStoredAdminPassword = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);
    // If previously stored with the initial placeholder 'mirchi360admin', migrate to 360merchiadmin
    if (saved === 'mirchi360admin') {
      localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, DEFAULT_ADMIN_PASSWORD);
      return DEFAULT_ADMIN_PASSWORD;
    }
    return saved && saved.trim() ? saved : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getStoredAdminPassword();
    const input = password.trim();

    // Check exact match, or allow forgiving spelling 360mirchiadmin if set to 360merchiadmin
    const isMatch =
      input === correctPassword ||
      (correctPassword === '360merchiadmin' && input === '360mirchiadmin');

    if (isMatch) {
      setErrorMessage('');
      setPassword('');
      onSuccess();
    } else {
      setAttempts((prev) => prev + 1);
      setErrorMessage('Incorrect password. Only the authorized Admin can access this panel.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#18181A] border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#242428] border border-zinc-700 flex items-center justify-center shadow-lg shadow-[#FF6B35]/10">
            <Lock className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-xs font-bold text-[#FF6B35] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Single-Admin Protected
          </div>
          <h3 className="text-xl font-black text-white">Mirchi 360 Admin Login</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Enter the admin password to manage daily menu dishes, stock availability, PKR rates, and customer orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter admin password..."
                className="w-full bg-[#222226] border border-zinc-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMessage && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">Default Admin Password:</span>{' '}
            <code className="text-[#FF6B35] font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded">360merchiadmin</code>
            <p className="mt-1 text-[10px] text-zinc-500">
              You can change this password anytime in the Admin Dashboard settings.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { MirchiLogo } from './MirchiLogo';
import { Bell, ShoppingCart, User, MapPin, Sliders } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenNotifications,
  onOpenProfile,
  onOpenAdmin,
  unreadCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left Side: Prominent Mirchi 360 Logo and Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] rounded-xl p-1"
            aria-label="Mirchi 360 Home"
          >
            <MirchiLogo size={42} className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                MIRCHI
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FF6B35]">
                360
              </span>
            </div>
          </a>

          {/* Quick Delivery Location Pill */}
          <button
            onClick={onOpenProfile}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-[#242424] border border-zinc-800/80 text-xs text-[#E0E0E0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="font-medium text-white truncate max-w-[150px]">DHA / Clifton, Karachi</span>
            <span className="text-zinc-500">·</span>
            <span className="text-emerald-400 font-medium">20-30 min</span>
          </button>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <a href="#signature" className="hover:text-[#FF6B35] transition-colors">
            Signature Picks
          </a>
          <a href="#combos" className="hover:text-[#FF6B35] transition-colors">
            Combos
          </a>
          <a href="#deals" className="hover:text-[#FF6B35] transition-colors">
            Weekend Deals
          </a>
          <a href="#rewards" className="hover:text-[#FF6B35] transition-colors">
            Rewards
          </a>
          <a href="#tracker" className="hover:text-[#FF6B35] transition-colors">
            Live Tracker
          </a>
        </nav>

        {/* Right Side: Admin Button, Profile Icon, Notification Bell, Shopping Cart Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Single-Admin Login Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1F1F24] hover:bg-[#292930] border border-amber-500/40 hover:border-[#FF6B35] text-amber-300 hover:text-white text-xs font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] cursor-pointer"
              title="Single-Admin Login (Password Protected)"
              aria-label="Admin Login"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#262626] border border-zinc-800/90 text-[#E0E0E0] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6B35] rounded-full ring-2 ring-[#121212]" />
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenProfile}
            className="p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#262626] border border-zinc-800/90 text-[#E0E0E0] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] cursor-pointer"
            aria-label="User profile and account"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF6B35]/20 hover:shadow-[#FF6B35]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full bg-white text-[#FF6B35] tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

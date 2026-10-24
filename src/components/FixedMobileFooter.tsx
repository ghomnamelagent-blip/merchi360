import React from 'react';
import { Home, Utensils, ShoppingCart, Percent, User } from 'lucide-react';

interface FixedMobileFooterProps {
  activeTab: string;
  cartCount: number;
  onTabChange: (tab: string) => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
}

export const FixedMobileFooter: React.FC<FixedMobileFooterProps> = ({
  activeTab,
  cartCount,
  onTabChange,
  onOpenCart,
  onOpenProfile,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#121212]/95 backdrop-blur-md border-t border-zinc-800/90 px-3 py-1.5 safe-area-bottom shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Home */}
        <button
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-[#FF6B35]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => {
            onTabChange('menu');
            const el = document.getElementById('signature');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'menu' ? 'text-[#FF6B35]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Utensils className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>

        {/* Elevated Center "Order" Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onOpenCart}
            className="w-14 h-14 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-[#FF6B35]/40 border-4 border-[#121212] active:scale-95 transition-transform"
            aria-label={`Open order cart with ${cartCount} items`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#FF6B35] font-black text-[11px] flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
          <span className="text-[10px] font-bold text-white mt-0.5">Order</span>
        </div>

        {/* Deals */}
        <button
          onClick={() => {
            onTabChange('deals');
            const el = document.getElementById('deals');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'deals' ? 'text-[#FF6B35]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Percent className="w-5 h-5 mb-0.5" />
          <span>Deals</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => {
            onTabChange('profile');
            onOpenProfile();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-[#FF6B35]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};

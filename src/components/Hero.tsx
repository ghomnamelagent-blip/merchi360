import React from 'react';
import { Search, SlidersHorizontal, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilterModal: () => void;
  hasActiveFilters?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilterModal,
  hasActiveFilters = false,
}) => {
  return (
    <section className="relative w-full overflow-hidden min-h-[560px] md:min-h-[640px] flex items-center justify-center">
      {/* Background Chef Image with High-Contrast Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Professional chef in black attire carefully preparing artisanal spicy fried specialties"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />
        {/* Layered dark scrims to ensure AAA legibility and dark-mode aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-[#121212]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/95 via-[#121212]/75 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center">
        {/* Quality Micro-Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1C1E]/90 border border-zinc-700/80 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span className="font-bold text-white">Mirchi 360</span>
          <span className="text-zinc-500">·</span>
          <span className="text-[#FF6B35] font-semibold">Hot & Crisp 360°</span>
          <span className="text-zinc-500">·</span>
          <span>Artisan Spice Specialties</span>
          <span className="text-zinc-500">·</span>
          <span className="text-[#FF6B35]">Chef Plated</span>
        </div>

        {/* Hero Title with 'MIRCHI 360' In Behind On Page */}
        <div className="relative w-full max-w-4xl mx-auto mb-5">
          {/* Ambient Background Watermark Text 'MIRCHI 360' In Behind On Page */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none pointer-events-none text-white/[0.04] font-black uppercase tracking-widest text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] leading-none whitespace-nowrap"
          >
            MIRCHI 360
          </div>

          <h1 className="relative text-center tracking-tight drop-shadow-md">
            <span className="font-script text-white text-5xl sm:text-7xl md:text-8xl block font-bold transform -rotate-1 hover:rotate-0 transition-transform duration-300 drop-shadow-lg">
              Mirchi 360
            </span>
            <span
              style={{ fontSize: '0px', fontWeight: 'normal' }}
              className="text-[#FF6B35] font-normal text-[0px] uppercase tracking-tighter block mt-0 drop-shadow-lg overflow-hidden h-0 select-none pointer-events-none"
            >
              Fiery Hot Crunch, Delivered Fast.
            </span>
          </h1>
        </div>

        {/* Short Descriptive Text */}
        <p
          style={{ paddingLeft: '0px', color: '#e0e0e0', fontSize: '14px' }}
          className="pl-0 text-[#e0e0e0] text-[14px] max-w-2xl mb-8 font-normal leading-relaxed text-balance drop-shadow"
        >
          Hot, fresh, and irresistibly crunchy fried chicken, Nashville fire burgers, and platters in Pakistan. Order now!
        </p>

        {/* Prominent Search Bar with Filter Icon */}
        <div className="w-full max-w-2xl relative">
          <div className="relative flex items-center rounded-2xl bg-[#1A1A1A]/95 backdrop-blur-xl border border-zinc-700/90 hover:border-[#FF6B35]/70 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/30 transition-all shadow-2xl p-2">
            <div className="pl-3.5 pr-2 text-zinc-400">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for meals, spicy burgers, wings, or combos..."
              className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base px-2 py-2 focus:outline-none focus:ring-0"
              aria-label="Search menu"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full transition-colors mr-1 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

            <button
              onClick={onToggleFilterModal}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                hasActiveFilters
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-[#262626] hover:bg-[#323232] text-zinc-200 border border-zinc-700/60'
              }`}
              aria-label="Open filter options"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Subtle Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6B35]" />
            <span>Average 24 min delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
            <span>100% Halal & Fresh Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF6B35] font-bold">★ 4.9</span>
            <span>Over 10,000+ satisfied foodies</span>
          </div>
        </div>
      </div>
    </section>
  );
};

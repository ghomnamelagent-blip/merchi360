import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { formatPKR } from '../utils/format';

export interface FilterOptions {
  sortBy: 'popular' | 'rating' | 'priceAsc' | 'priceDesc';
  onlyBestSellers: boolean;
  maxPrice: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onUpdateFilters: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#18181A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-[#141416] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-extrabold text-base text-white">Filter & Sort Menu</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 text-xs text-zinc-300">
          {/* Sort By */}
          <div className="space-y-2.5">
            <label className="font-bold uppercase tracking-wider text-white block">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'popular', label: 'Most Popular' },
                { id: 'rating', label: 'Highest Rated' },
                { id: 'priceAsc', label: 'Price: Low to High' },
                { id: 'priceDesc', label: 'Price: High to Low' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, sortBy: opt.id as FilterOptions['sortBy'] })}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    filters.sortBy === opt.id
                      ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                      : 'bg-[#202024] border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Flags */}
          <div className="space-y-2.5">
            <label className="font-bold uppercase tracking-wider text-white block">
              Special Picks
            </label>
            <button
              type="button"
              onClick={() => onUpdateFilters({ ...filters, onlyBestSellers: !filters.onlyBestSellers })}
              className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                filters.onlyBestSellers
                  ? 'bg-emerald-950/40 border-emerald-600 text-white'
                  : 'bg-[#202024] border-zinc-800 text-zinc-400'
              }`}
            >
              <span>Show Best Sellers Only</span>
              {filters.onlyBestSellers && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Max Price Slider in PKR */}
          <div className="space-y-2.5">
            <div className="flex justify-between font-bold">
              <label className="uppercase tracking-wider text-white">Max Budget</label>
              <span className="text-[#FF6B35] font-mono text-sm">{formatPKR(filters.maxPrice)}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={filters.maxPrice}
              onChange={(e) => onUpdateFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#FF6B35] bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
              <span>Rs. 200</span>
              <span>Rs. 2,500</span>
              <span>Rs. 5,000+</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141416] border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] text-white text-xs font-bold shadow-md shadow-[#FF6B35]/20 transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

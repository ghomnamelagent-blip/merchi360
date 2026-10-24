import React, { useState, useMemo } from 'react';
import { Plus, Check, Star, XCircle, Search, Flame, Sparkles } from 'lucide-react';
import { MenuItem, DishVariant } from '../types';
import { CATEGORIES, FALLBACK_FOOD_IMG } from '../data/menuData';
import { formatPKR } from '../utils/format';

interface KioskMenuGridProps {
  items: MenuItem[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (item: MenuItem, variant?: DishVariant) => void;
}

export const KioskMenuGrid: React.FC<KioskMenuGridProps> = ({
  items,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
}) => {
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Group or filter items
  const filteredDishes = useMemo(() => {
    return items.filter((dish) => {
      const matchesCategory =
        activeCategory === 'All Items' || dish.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q) ||
        dish.itemNumber.toString().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleAdd = (dish: MenuItem, variant?: DishVariant) => {
    onAddToCart(dish, variant);
    const key = `${dish.id}-${variant ? variant.name : 'base'}`;
    setJustAddedId(key);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === key ? null : prev));
    }, 1200);
  };

  return (
    <section id="menu-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Buttons Bar (Digital Kiosk Style) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-xs font-bold text-[#FF6B35] mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Digital Menu Kiosk
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mirchi 360 Verified Menu
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Select any category to view individual dish buttons, live rates in PKR, and size variants.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs font-semibold text-zinc-400">Total Items</span>
            <div className="text-lg font-black text-[#FF6B35]">{items.length} Dishes</div>
          </div>
        </div>

        {/* Category Buttons Carousel / Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'All Items'
                ? items.length
                : items.filter((i) => i.category === cat.id).length;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 snap-start cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#ff5a1f] text-white border-[#FF6B35] shadow-lg shadow-[#FF6B35]/25 scale-[1.02]'
                    : 'bg-[#1A1A1E] hover:bg-[#24242A] text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search status if active */}
      {searchQuery && (
        <div className="mb-4 flex items-center justify-between text-xs text-zinc-400 bg-[#1A1A1E] p-3 rounded-xl border border-zinc-800">
          <span>
            Found <strong className="text-white">{filteredDishes.length}</strong> dishes matching "
            <strong className="text-[#FF6B35]">{searchQuery}</strong>"
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-[#FF6B35] hover:underline font-bold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Dish Buttons / Cards Grid */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-20 bg-[#161618] rounded-3xl border border-zinc-800 p-8">
          <Flame className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No dishes found in this category</h3>
          <p className="text-xs text-zinc-400 mt-1">Try selecting "All Items" or searching for a different dish.</p>
          <button
            onClick={() => {
              onSelectCategory('All Items');
              onSearchChange('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => {
            const inStock = dish.inStock !== false;
            const hasVariants = dish.variants && dish.variants.length > 0;

            return (
              <div
                key={dish.id}
                className={`relative rounded-3xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                  inStock
                    ? 'bg-[#18181B] border-zinc-850 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50'
                    : 'bg-[#141416] border-red-950/40 opacity-70'
                }`}
              >
                {/* Out of Stock Overlay / Badge */}
                {!inStock && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Out of Stock
                  </div>
                )}

                {dish.isSpecial && inStock && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Special Deal
                  </div>
                )}

                {/* Main Card Content: 90x90px Photo + Name + Details */}
                <div className="flex items-start gap-3.5">
                  {/* Sharp 90x90px Photo Thumbnail on Front with Automatic Fallback */}
                  <div className="relative w-[90px] h-[90px] rounded-2xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-750 shadow-md">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent py-0.5 text-center">
                      <span className="text-[9px] font-mono font-bold text-zinc-300">#{dish.itemNumber}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                        {dish.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-[#FF6B35] block mt-0.5">
                      {dish.category}
                    </span>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Rates & Clickable Variant Buttons */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  {hasVariants ? (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                        <span>Select Size / Variant:</span>
                        <span className="text-zinc-500">Click to add</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dish.variants!.map((variant) => {
                          const isJustAdded = justAddedId === `${dish.id}-${variant.name}`;

                          return (
                            <button
                              key={variant.name}
                              disabled={!inStock}
                              onClick={() => handleAdd(dish, variant)}
                              className={`flex-1 min-w-[120px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                                !inStock
                                  ? 'bg-zinc-850 text-zinc-500 border-zinc-800 cursor-not-allowed'
                                  : isJustAdded
                                  ? 'bg-emerald-500 text-white border-emerald-400 scale-[0.98]'
                                  : 'bg-[#222227] hover:bg-[#FF6B35] text-white hover:text-white border-zinc-700/80 hover:border-[#FF6B35] active:scale-95 shadow-sm'
                              }`}
                              title={`Add ${dish.name} (${variant.name}) for ${formatPKR(variant.price)}`}
                            >
                              <span className="font-extrabold">{variant.name}:</span>
                              <span className="ml-1 text-[#FF8B5A] group-hover:text-white">
                                {isJustAdded ? (
                                  <span className="flex items-center gap-1 text-white">
                                    <Check className="w-3.5 h-3.5" /> Added
                                  </span>
                                ) : (
                                  formatPKR(variant.price)
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Single Rate Dish Button */
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Rate</span>
                        <span className="text-base font-black text-white">{formatPKR(dish.price)}</span>
                      </div>

                      <button
                        disabled={!inStock}
                        onClick={() => handleAdd(dish)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md ${
                          !inStock
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : justAddedId === `${dish.id}-base`
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-[#FF6B35] to-[#ff5a1f] hover:from-[#ff5a1f] hover:to-[#FF6B35] text-white shadow-[#FF6B35]/25 active:scale-95'
                        }`}
                        title={`Add ${dish.name} to order`}
                      >
                        {justAddedId === `${dish.id}-base` ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add {formatPKR(dish.price)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

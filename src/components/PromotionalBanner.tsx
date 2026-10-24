import React from 'react';
import { Sparkles, ArrowRight, Clock, Tag } from 'lucide-react';
import { PROMO_IMAGE } from '../data/menuData';

interface PromotionalBannerProps {
  onClaimDeal: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onClaimDeal }) => {
  return (
    <section id="deals" className="py-10 md:py-14 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#FF5514] to-[#D9430A] shadow-2xl shadow-[#FF6B35]/25 text-white">
          {/* Subtle background radial pattern */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-10 lg:p-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Limited Time Fest</span>
                <span className="text-white/40">·</span>
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>This Weekend Only</span>
              </div>

              {/* Bold Impactful Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white drop-shadow-md">
                MIRCHI 360 DEALS!
              </h2>

              {/* Sub-headline */}
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-100 leading-snug drop-shadow">
                Get 20% OFF all buckets & platters.
              </p>

              <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed font-medium">
                Double-battered, kettle-fried to perfection, and served piping hot. Grab your Mirchi 360 weekend feast in Pakistan before time runs out!
              </p>

              {/* Promo code chip and action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 backdrop-blur-md font-mono text-sm tracking-wider font-bold">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>CODE: <span className="text-amber-300">MIRCHI20</span></span>
                </div>

                <button
                  onClick={onClaimDeal}
                  className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#121212] font-black text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-black/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-5 h-5 text-[#FF6B35]" />
                </button>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src={PROMO_IMAGE}
                  alt="Delicious weekend chicken spread with crispy wings, fries, and drinks"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/10">
                  🔥 Instant 20% Applied at Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

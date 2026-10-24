import React from 'react';
import { Award, Gift, Sparkles, ChevronRight, Flame } from 'lucide-react';

interface RewardsSectionProps {
  points?: number;
  maxPoints?: number;
  onOpenRewardsModal: () => void;
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  points = 1200,
  maxPoints = 2000,
  onOpenRewardsModal,
}) => {
  const percentage = Math.min(100, Math.round((points / maxPoints) * 100));

  return (
    <section id="rewards" className="py-12 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle amber gradient backdrop */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-xs font-bold text-[#FF6B35]">
                <Award className="w-3.5 h-3.5" />
                <span>Mirchi 360 Club</span>
                <span className="text-zinc-500">·</span>
                <span className="text-white">Gold Tier</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                Earn Free Chicken With Every Bite
              </h3>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                You’re only <span className="text-white font-bold">{maxPoints - points} points</span> away
                from unlocking a <span className="text-[#FF6B35] font-semibold">Free 6-Piece Crispy Wings</span> reward on your next order!
              </p>

              {/* Progress Bar Container */}
              <div className="pt-2 max-w-xl">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                  <span className="text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#FF6B35]" />
                    <span>Current Balance:</span>
                    <span className="text-[#FF6B35] font-mono tabular-nums text-base">{points.toLocaleString()} pts</span>
                  </span>
                  <span className="text-zinc-400 font-mono tabular-nums">
                    {maxPoints.toLocaleString()} pts target
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-3.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B35] via-[#ff824d] to-[#ffa06e] rounded-full transition-all duration-1000 shadow-md shadow-[#FF6B35]/40"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-2 font-medium">
                  <span>Level 2: Crispy Lover</span>
                  <span>{percentage}% reached</span>
                  <span>Level 3: Master Cruncher</span>
                </div>
              </div>
            </div>

            {/* Right Card Action / Perks Preview */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="bg-[#141414] border border-zinc-800/90 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 font-medium">Ready to claim</span>
                    <h4 className="text-sm font-bold text-white">Free Loaded Waffle Fries</h4>
                    <span className="text-[11px] text-emerald-400">Unlocked at 800 pts</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                  Active
                </span>
              </div>

              <button
                onClick={onOpenRewardsModal}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>View My Rewards</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

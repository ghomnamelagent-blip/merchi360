import React from 'react';
import { X, Award, Gift, Sparkles, Check, Flame, ChevronRight } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  onRedeemReward: (title: string, cost: number) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  points,
  onRedeemReward,
}) => {
  if (!isOpen) return null;

  const rewards = [
    {
      id: 'rw-1',
      title: 'Free Loaded Waffle Fries',
      description: 'Golden waffle fries drizzled in smoked paprika cheddar cheese sauce and seasoned herbs.',
      cost: 800,
      icon: Gift,
    },
    {
      id: 'rw-2',
      title: 'Free 6-Piece Crispy Wings',
      description: 'Choice of Honey Glaze, Smoky BBQ, or Nashville Hot dipping glaze.',
      cost: 1500,
      icon: Flame,
    },
    {
      id: 'rw-3',
      title: 'Rs. 1,000 Off Next Bucket Order',
      description: 'Valid on any 8-Piece, 12-Piece, or 16-Piece family bucket feast.',
      cost: 2000,
      icon: Award,
    },
    {
      id: 'rw-4',
      title: 'Free Artisan Hand Pie & Drink',
      description: 'Cinnamon apple hand pie paired with chilled spicy ginger beer or sweet tea.',
      cost: 1200,
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#18181A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-[#141416] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">Mirchi 360 Club</div>
              <h3 className="font-black text-xl text-white">Your Reward Vault</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close rewards modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#202024] to-[#151518] border border-zinc-700/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                Available Crunch Points
              </span>
              <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-2">
                <span className="text-[#FF6B35] font-mono tabular-nums">{points.toLocaleString()}</span>
                <span className="text-sm font-semibold text-zinc-400">pts</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">
                ★ Gold Tier Member (10 pts per Rs. 100 spent)
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          {/* Rewards List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Unlockable Rewards
            </h4>

            {rewards.map((reward) => {
              const Icon = reward.icon;
              const canRedeem = points >= reward.cost;

              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    canRedeem
                      ? 'bg-[#202024] border-zinc-700/90 hover:border-[#FF6B35]/70'
                      : 'bg-[#151517] border-zinc-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        canRedeem ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">{reward.title}</h5>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono text-[#FF6B35] shrink-0 tabular-nums">
                      {reward.cost} pts
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      {canRedeem
                        ? 'Eligible for instant redemption'
                        : `${reward.cost - points} more points needed`}
                    </span>

                    <button
                      disabled={!canRedeem}
                      onClick={() => onRedeemReward(reward.title, reward.cost)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        canRedeem
                          ? 'bg-[#FF6B35] hover:bg-[#ff5a1f] text-white shadow-md shadow-[#FF6B35]/20 cursor-pointer active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Redeem Perk' : 'Locked'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

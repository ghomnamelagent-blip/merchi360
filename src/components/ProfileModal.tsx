import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Award,
  History,
  RotateCcw,
  Check,
  ChevronRight,
  PackageCheck,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { PastOrder, CartItem } from '../types';
import { formatPKR } from '../utils/format';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRewards: () => void;
  pastOrders: PastOrder[];
  onReorder: (items: CartItem[]) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenRewards,
  pastOrders,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [selectedAddress, setSelectedAddress] = useState('House #14, Street 5, Phase 6, DHA, Karachi');
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReorderClick = (order: PastOrder) => {
    setReorderedId(order.id);
    onReorder(order.items);
    setTimeout(() => {
      setReorderedId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#18181A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-[#141416] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8B5A] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#FF6B35]/25">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Mirchi Club Member</h3>
                <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF6B35] font-bold px-2 py-0.5 rounded-full border border-[#FF6B35]/30">
                  Gold Cruncher
                </span>
              </div>
              <p className="text-xs text-zinc-400">Verified Mobile Account</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-[#141416]/90 px-5 pt-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#FF6B35] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#FF6B35] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Order History</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-[10px] font-bold">
              {pastOrders.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300 text-xs">
          {activeTab === 'profile' ? (
            <>
              {/* Rewards Tier Card */}
              <div
                onClick={() => {
                  onClose();
                  onOpenRewards();
                }}
                className="bg-[#202024] hover:bg-[#252529] border border-zinc-700/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Mirchi 360 Loyalty Status
                    </span>
                    <h4 className="font-bold text-sm text-white">Mirchi 360 Gold Cruncher</h4>
                    <span className="text-[#FF6B35] font-semibold">1,200 Points Available</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </div>

              {/* Saved Delivery Addresses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Saved Delivery Locations
                </h4>

                {[
                  { label: 'Home', address: 'House #14, Street 5, Phase 6, DHA, Karachi', isPrimary: true },
                  { label: 'Office', address: 'Floor 4, Tech Centre, Main Boulevard, Gulberg, Lahore', isPrimary: false },
                ].map((addr) => (
                  <div
                    key={addr.label}
                    onClick={() => setSelectedAddress(addr.address)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedAddress === addr.address
                        ? 'bg-[#FF6B35]/10 border-[#FF6B35] text-white'
                        : 'bg-[#202024] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#FF6B35]" />
                      <div>
                        <span className="font-bold text-white block">{addr.label}</span>
                        <span className="text-[11px] text-zinc-400">{addr.address}</span>
                      </div>
                    </div>

                    {selectedAddress === addr.address && (
                      <span className="text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/20 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Preferences */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Dietary & Flavor Preferences
                </h4>
                <div className="p-3.5 rounded-xl bg-[#202024] border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Favorite Spice Level:</span>
                    <span className="text-[#FF6B35] font-bold">Nashville Hot Fire</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Preferred Sauce:</span>
                    <span className="text-zinc-300 font-semibold">Smoky Chipotle BBQ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Packaging:</span>
                    <span className="text-emerald-400 font-semibold">Thermal Steam-Lock Vent</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Order History Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Past Orders & Receipts
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Click 'Reorder' to instantly add your favorite meals back to your basket.
                  </p>
                </div>
              </div>

              {pastOrders.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No past orders yet. Place your first order today!</p>
                </div>
              ) : (
                pastOrders.map((order) => {
                  const isJustReordered = reorderedId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#202024] border border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-700 space-y-3.5"
                    >
                      {/* Top Row: Order ID, Date & Status */}
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-xs">
                              #{order.orderNumber}
                            </span>
                            <span className="text-zinc-600">·</span>
                            <span className="text-[11px] text-zinc-400">{order.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          <PackageCheck className="w-3 h-3" />
                          <span>{order.status}</span>
                        </div>
                      </div>

                      {/* Itemized List */}
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-item-${idx}`}
                            className="flex items-center justify-between text-zinc-300 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate max-w-[70%]">
                              <span className="w-4 h-4 rounded bg-[#18181A] text-zinc-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {item.quantity}
                              </span>
                              <span className="truncate text-white font-medium">
                                {item.name || (item as any).menuItem?.name || 'Dish'}
                              </span>
                              {item.selectedVariant && (
                                <span className="text-zinc-500 text-[11px] shrink-0">
                                  ({item.selectedVariant})
                                </span>
                              )}
                            </div>

                            <span className="tabular-nums text-zinc-300 font-mono text-[11px]">
                              {formatPKR((item.price || (item as any).menuItem?.price || 0) * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Row: Total & Reorder Button */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-zinc-400 text-[11px]">Total:</span>
                          <span className="text-white font-black text-sm font-mono tabular-nums">
                            {formatPKR(order.total)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleReorderClick(order)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md cursor-pointer ${
                            isJustReordered
                              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                              : 'bg-[#FF6B35] hover:bg-[#ff5a1f] text-white shadow-[#FF6B35]/25 hover:scale-102 active:scale-98'
                          }`}
                          aria-label={`Reorder order #${order.orderNumber}`}
                        >
                          {isJustReordered ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reorder</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

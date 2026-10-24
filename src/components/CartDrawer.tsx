import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR } from '../utils/format';
import { FALLBACK_FOOD_IMG } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => boolean;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(150);

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 2000;
  const STANDARD_DELIVERY_FEE = 150;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || (item as any).menuItem?.price || 0) * item.quantity,
    0
  );
  const discountRate = appliedPromo ? 0.2 : 0;
  const discount = subtotal * discountRate;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const estimatedTax = (subtotal - discount) * 0.05; // 5% provincial sales tax
  const total = Math.max(0, subtotal - discount + deliveryFee + estimatedTax + (items.length > 0 ? selectedTip : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoMessage({ type: 'success', text: '20% Mirchi 360 discount applied!' });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid promo code. Try MIRCHI20' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#18181A] border-l border-zinc-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Your Mirchi 360 Basket</h3>
                <span className="text-xs text-zinc-400">
                  {items.length} {items.length === 1 ? 'dish' : 'dishes'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress bar */}
          <div className="px-5 py-3 bg-[#131315] border-b border-zinc-800/60 text-xs">
            {subtotal >= FREE_DELIVERY_THRESHOLD ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>You unlocked FREE Delivery across town!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between font-medium text-zinc-400 mb-1.5">
                  <span>
                    Add <strong className="text-white">{formatPKR(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more for FREE delivery
                  </span>
                  <span className="text-[#FF6B35] font-bold">
                    {Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B35] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-white">Your cart is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  Craving authentic Biryani, sizzling Karahi, or BBQ? Click any dish button to add!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#ff5a1f] transition-all shadow-md shadow-[#FF6B35]/20 cursor-pointer"
                >
                  Explore 194 Dishes
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemImg = item.image || (item as any).menuItem?.image || FALLBACK_FOOD_IMG;
                const itemName = item.name || (item as any).menuItem?.name || 'Dish';
                const itemPrice = item.price || (item as any).menuItem?.price || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-[#202024] border border-zinc-800/80 rounded-2xl p-3.5 flex gap-3.5 items-start"
                  >
                    <img
                      src={itemImg}
                      alt={itemName}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-900 border border-white/5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-white truncate">{itemName}</h4>
                          {item.selectedVariant && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-extrabold uppercase">
                              {item.selectedVariant}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/80">
                        <div className="flex items-center bg-[#18181A] rounded-full border border-zinc-700/80 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-white font-mono tabular-nums">
                          {formatPKR(itemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-[#141416] border-t border-zinc-800 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code (MIRCHI20)"
                    className="w-full bg-[#1C1C1E] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    promoMessage.type === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950/40 text-red-300 border border-red-800'
                  }`}
                >
                  {promoMessage.type === 'success' ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{promoMessage.text}</span>
                </div>
              )}

              {/* Courier Tip Options */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1.5 font-semibold">
                  Add Rider Tip (PKR):
                </span>
                <div className="flex gap-2">
                  {[0, 100, 150, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedTip(amount)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                        selectedTip === amount
                          ? 'bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]'
                          : 'bg-[#1C1C1E] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {amount === 0 ? 'None' : `+${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-850">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-mono">{formatPKR(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo Discount (20%)</span>
                    <span>-{formatPKR(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-zinc-200 font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">FREE</span>
                    ) : (
                      formatPKR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST / Tax (5%)</span>
                  <span className="text-zinc-200 font-mono">{formatPKR(estimatedTax)}</span>
                </div>

                {selectedTip > 0 && (
                  <div className="flex justify-between">
                    <span>Rider Tip</span>
                    <span className="text-zinc-200 font-mono">{formatPKR(selectedTip)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-[#FF6B35] font-mono">{formatPKR(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#ff5a1f] hover:from-[#ff5a1f] hover:to-[#FF6B35] text-white font-extrabold text-sm shadow-xl shadow-[#FF6B35]/25 flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

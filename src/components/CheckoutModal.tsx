import React, { useState } from 'react';
import { X, CreditCard, Banknote, ShieldCheck, MapPin, Phone, User, Smartphone } from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderSuccess: (details: { name: string; address: string; phone: string; paymentMethod: string }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderSuccess,
}) => {
  const [name, setName] = useState('Hamza Khan');
  const [phone, setPhone] = useState('0300 1234567');
  const [address, setAddress] = useState('House #14, Street 5, Phase 6, DHA, Karachi');
  const [instructions, setInstructions] = useState('Call upon arrival, thermal heat-lock delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess({
        name,
        address,
        phone,
        paymentMethod:
          paymentMethod === 'cod'
            ? 'Cash on Delivery (COD)'
            : paymentMethod === 'jazzcash'
            ? 'JazzCash / EasyPaisa'
            : 'Credit / Debit Card',
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#18181A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl text-white">Complete Delivery Order</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Hot & crispy chicken arriving in 20-30 mins</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 flex-1">
          {/* Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Delivery Details</h4>

            <div>
              <label className="text-zinc-400 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#222225] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-medium block mb-1">Mobile Phone (for delivery SMS updates)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full bg-[#222225] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-medium block mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#222225] border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-medium block mb-1">Drop-off Instructions (Optional)</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Gate number, floor, or landmark notes"
                className="w-full bg-[#222225] border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment Method</h4>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                    : 'bg-[#222225] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-[11px]">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'jazzcash'
                    ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                    : 'bg-[#222225] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#FF6B35]" />
                <span className="font-semibold text-[11px]">JazzCash / EasyPaisa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                    : 'bg-[#222225] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-[11px]">Debit / Credit Card</span>
              </button>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-[#131315] border border-zinc-800 rounded-xl p-3 flex items-center gap-2.5 text-zinc-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>100% Halal Certified Kitchen. Freshness and crunchiness guaranteed upon arrival.</span>
          </div>

          {/* Action button with PKR Total */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] text-white font-extrabold text-sm shadow-xl shadow-[#FF6B35]/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Transmitting Order to Kitchen Fryer...</span>
              ) : (
                <>
                  <span>Confirm Order</span>
                  <span>·</span>
                  <span className="tabular-nums font-mono">{formatPKR(total)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

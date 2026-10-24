import React, { useState } from 'react';
import {
  X,
  Bike,
  Flame,
  CheckCircle2,
  PackageCheck,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { ActiveOrder, OrderStatus } from '../types';
import { formatPKR } from '../utils/format';

interface LiveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder;
  onUpdateStatus: (newStatus: OrderStatus) => void;
}

export const LiveTrackerModal: React.FC<LiveTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [callAlert, setCallAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const statusProgress: Record<OrderStatus, { pct: number; label: string; text: string }> = {
    confirmed: {
      pct: 25,
      label: 'Order Confirmed',
      text: 'Our kitchen team has reviewed your order and queued the chicken for spice marination and double battering.',
    },
    preparing: {
      pct: 55,
      label: 'Frying to Golden Perfection',
      text: 'Your chicken is sizzling in our pressure kettle right now. Sides and dipping sauces are being packed fresh.',
    },
    on_the_way: {
      pct: 85,
      label: 'Rider On the Way',
      text: 'Your order is securely packed in an insulated thermal heat-lock bag to keep the skin ultra-crisp.',
    },
    delivered: {
      pct: 100,
      label: 'Delivered Fresh & Hot',
      text: 'Order completed! Enjoy the crunch. Don’t forget to leave a review to earn +50 Crunch Points.',
    },
    cancelled: {
      pct: 0,
      label: 'Order Cancelled',
      text: 'This order was cancelled by the kitchen or customer.',
    },
  };

  const currentInfo = statusProgress[order.status] || statusProgress.preparing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#18181A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#141416]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">Order #{order.orderId}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs font-bold text-emerald-400">Live GPS</span>
              </div>
              <h3 className="font-black text-lg text-white">Mirchi 360 Express Tracker</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close live tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300">
          {/* Simulated Dark Mode Map Component */}
          <div className="relative aspect-16/9 w-full bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-4">
            {/* Map Grid and streets representation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Simulated Road Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 60 140 Q 180 80 280 120 T 520 70"
                fill="none"
                stroke="#FF6B35"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Top Map Floating Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>
                  {order.status === 'delivered' ? 'Delivered' : `Arriving in ~${order.estimatedMinutes} mins`}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Thermal Bag: 165°F Peak Heat</span>
              </div>
            </div>

            {/* Map Pins */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-10">
              {/* Kitchen Pin */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#1E1E22] border-2 border-zinc-600 text-[#FF6B35] flex items-center justify-center shadow-lg">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded">Mirchi Kitchen</span>
              </div>

              {/* Rider Pin */}
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-11 h-11 rounded-full bg-[#FF6B35] border-2 border-white text-white flex items-center justify-center shadow-xl shadow-[#FF6B35]/50">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 bg-[#FF6B35] px-2 py-0.5 rounded shadow">
                  Tariq (Rider)
                </span>
              </div>

              {/* Destination Pin */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-1 bg-black/60 px-1.5 py-0.5 rounded">You</span>
              </div>
            </div>

            {/* Bottom Address Pin */}
            <div className="relative z-10 text-right">
              <span className="text-[11px] text-zinc-400 bg-black/70 px-2.5 py-1 rounded-md border border-white/5">
                Destination: {order.address}
              </span>
            </div>
          </div>

          {/* Interactive Simulation Switcher */}
          <div className="bg-[#202024] border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Interactive Status Simulator
              </span>
              <span className="text-[11px] text-[#FF6B35] font-semibold">Click any stage to simulate:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['confirmed', 'preparing', 'on_the_way', 'delivered'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                    order.status === st
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white shadow-md'
                      : 'bg-[#18181A] border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Status Details */}
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span>{currentInfo.label}</span>
              </h4>
              <span className="text-xs font-mono font-bold text-[#FF6B35]">
                {currentInfo.pct}% Complete
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {currentInfo.text}
            </p>
          </div>

          {/* Courier Card */}
          <div className="bg-[#202024] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                TR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-sm text-white">Tariq (Courier)</h5>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    ★ 4.95
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Mirchi Fleet · 125cc Insulated Carrier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCallAlert('Calling rider Tariq at 0300-8812345...');
                  setTimeout(() => setCallAlert(null), 3000);
                }}
                className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-700 cursor-pointer"
                aria-label="Call driver"
                title="Call rider"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Pin Sent!' : 'Send Gate Pin'}</span>
              </button>
            </div>
          </div>

          {callAlert && (
            <div className="p-3 rounded-xl bg-[#202024] border border-[#FF6B35] text-xs text-white text-center animate-in fade-in">
              {callAlert}
            </div>
          )}

          {/* Itemized Order Summary */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Items</h5>
            <div className="space-y-2">
              {order.items.map((it) => {
                const itemName = it.name || (it as any).menuItem?.name || 'Dish';
                const itemPrice = it.price || (it as any).menuItem?.price || 0;
                return (
                  <div key={it.id} className="flex justify-between items-center text-xs text-zinc-300">
                    <span>
                      <strong className="text-white">{it.quantity}x</strong> {itemName} {it.selectedVariant ? `(${it.selectedVariant})` : ''}
                    </span>
                    <span className="tabular-nums text-white font-mono font-medium">
                      {formatPKR(itemPrice * it.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-sm font-bold text-white">
              <span>Total Paid</span>
              <span className="text-[#FF6B35] font-mono tabular-nums text-base">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

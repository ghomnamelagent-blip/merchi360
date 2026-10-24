import React from 'react';
import {
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ActiveOrder, OrderStatus } from '../types';

interface OrderTrackerProps {
  order: ActiveOrder;
  onOpenLiveTracker: () => void;
}

const steps: {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    status: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle2,
    description: 'Kitchen received order',
  },
  {
    status: 'preparing',
    label: 'Preparing',
    icon: Flame,
    description: 'Battering & double-frying',
  },
  {
    status: 'on_the_way',
    label: 'On the Way',
    icon: Bike,
    description: 'Rider en route with thermal bag',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    icon: PackageCheck,
    description: 'Arrived at your door piping hot',
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onOpenLiveTracker }) => {
  const statusIndexMap: Record<OrderStatus, number> = {
    confirmed: 0,
    preparing: 1,
    on_the_way: 2,
    delivered: 3,
    cancelled: 0,
  };

  const currentStepIndex = statusIndexMap[order.status] ?? 1;

  return (
    <section id="tracker" className="py-12 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Live Order Status
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs font-mono text-zinc-400">#{order.orderId}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Estimated Delivery in{' '}
                <span className="text-[#FF6B35]">{order.estimatedMinutes} Mins</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Delivering to: <span className="text-zinc-200">{order.address}</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLiveTracker}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B35] hover:bg-[#ff5a1f] text-white text-sm font-bold shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              >
                <span>Track My Order</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Progress Bar with Distinct Icons */}
          <div className="pt-8 pb-4">
            <div className="relative">
              {/* Background Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-800 -translate-y-1/2 z-0 hidden sm:block" />

              {/* Active Progress Line */}
              <div
                className="absolute top-6 left-6 h-1 bg-[#FF6B35] -translate-y-1/2 z-0 transition-all duration-700 hidden sm:block"
                style={{
                  width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 3rem)`,
                }}
              />

              {/* Progress Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.status}
                      className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2.5"
                    >
                      {/* Step Icon Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/30'
                            : isCurrent
                            ? 'bg-[#1C1C1E] border-[#FF6B35] text-[#FF6B35] shadow-lg shadow-[#FF6B35]/30 ring-4 ring-[#FF6B35]/20 animate-pulse'
                            : 'bg-[#18181B] border-zinc-700 text-zinc-500'
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Labels */}
                      <div className="flex-1 sm:flex-initial">
                        <span
                          className={`text-sm font-bold block ${
                            isCompleted || isCurrent ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-xs text-zinc-400 hidden sm:block mt-0.5">
                          {step.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

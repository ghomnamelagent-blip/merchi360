import React from 'react';
import { X, Bell, Flame, Tag, CheckCircle2, Clock } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromoNotification: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onSelectPromoNotification,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n-1',
      title: 'MIRCHI 360 CRUNCH DEALS! 20% OFF',
      message: 'Code MIRCHI20 is active! Save 20% on all buckets and platters through Sunday midnight.',
      time: '10 min ago',
      isNew: true,
      action: onSelectPromoNotification,
      icon: Tag,
      iconColor: 'text-[#FF6B35]',
    },
    {
      id: 'n-2',
      title: 'Order Status Update',
      message: 'Order #M360-8492 is sizzling in the fryer. Estimated delivery: 22 mins.',
      time: '24 min ago',
      isNew: true,
      icon: Flame,
      iconColor: 'text-amber-400',
    },
    {
      id: 'n-3',
      title: 'Reward Unlocked!',
      message: 'You have enough points to claim a Free Loaded Waffle Fries in your rewards vault.',
      time: '2 hours ago',
      isNew: false,
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-[#1A1A1E] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#141416] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF6B35]" />
            <h4 className="font-extrabold text-sm text-white">Notifications</h4>
            <span className="text-[10px] font-bold bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-full">
              2 New
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-3 space-y-2 overflow-y-auto">
          {notifications.map((notif) => {
            const Icon = notif.icon;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.action) notif.action();
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  notif.isNew
                    ? 'bg-[#222227] border-zinc-700/80 hover:border-[#FF6B35]/70'
                    : 'bg-[#18181A] border-zinc-800/80 hover:bg-[#1E1E22]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-xs text-white truncate">{notif.title}</h5>
                      <span className="text-[10px] text-zinc-500 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

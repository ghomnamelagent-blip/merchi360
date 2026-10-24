import React from 'react';
import { MirchiLogo } from './MirchiLogo';
import { Clock, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#0D0D0E] border-t border-zinc-900 text-zinc-400 text-xs pt-16 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <MirchiLogo size={38} className="w-9 h-9" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tracking-tight text-white uppercase">
                  MIRCHI <span className="text-[#FF6B35]">360</span>
                </span>
                <span className="text-xs text-[#FF6B35] font-bold">
                  HOT & CRISP
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Mirchi 360 delivers chef-crafted, small-batch crispy fried specialties, fiery Nashville burgers, and spiced platters directly to your doorstep with guaranteed 360-degree crunch in every bite.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <span>Central Cloud Kitchen Hubs: Karachi · Lahore · Islamabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <span>Operating Hours: Mon - Sun: 11:00 AM – 2:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <span>Kitchen Helpline: +92 300 1234360 / (021) 111-MIRCHI</span>
              </div>
            </div>
          </div>

          {/* Column 1: Menu */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Our Menu</h4>
            <ul className="space-y-2.5">
              <li><a href="#menu-section" className="hover:text-[#FF6B35] transition-colors">Desi & Biryani</a></li>
              <li><a href="#menu-section" className="hover:text-[#FF6B35] transition-colors">Karahi Specialties</a></li>
              <li><a href="#menu-section" className="hover:text-[#FF6B35] transition-colors">BBQ & Grills</a></li>
              <li><a href="#menu-section" className="hover:text-[#FF6B35] transition-colors">Burgers & Broast</a></li>
              <li><a href="#menu-section" className="hover:text-[#FF6B35] transition-colors">Special Value Deals</a></li>
            </ul>
          </div>

          {/* Column 2: Experience */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Experience</h4>
            <ul className="space-y-2.5">
              <li><a href="#tracker" className="hover:text-[#FF6B35] transition-colors">Live Order Tracker</a></li>
              <li><a href="#rewards" className="hover:text-[#FF6B35] transition-colors">Mirchi 360 Rewards</a></li>
              <li><a href="#deals" className="hover:text-[#FF6B35] transition-colors">Weekend Crunch Deals</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Corporate Catering</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Halal Kitchen Certification</a></li>
            </ul>
          </div>

          {/* Column 3: Trust & Quality */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Our Standards</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Halal & Fresh</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Fresh poultry and farm-sourced produce, seasoned with signature 11-spice masala daily.
                </p>
              </div>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-[#FF6B35] hover:text-white text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
          <p>© {new Date().getFullYear()} Mirchi 360. All rights reserved. Conversion-crafted premium delivery.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-amber-400 hover:text-white font-bold cursor-pointer"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

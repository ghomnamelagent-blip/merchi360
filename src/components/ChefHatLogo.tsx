import React from 'react';

interface ChefHatLogoProps {
  className?: string;
  size?: number;
}

export const ChefHatLogo: React.FC<ChefHatLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="hatGradient" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8B5A" />
            <stop offset="1" stopColor="#FF6B35" />
          </linearGradient>
          <linearGradient id="rimGradient" x1="10" y1="34" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B35" />
            <stop offset="1" stopColor="#D44917" />
          </linearGradient>
          <filter id="glowEffect" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF6B35" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Glow backdrop ring */}
        <circle cx="24" cy="24" r="22" fill="#1C1C1E" stroke="#FF6B35" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Chef's Hat Silhouette */}
        <g filter="url(#glowEffect)">
          {/* Top Puffs */}
          <path
            d="M17 25C15 25 13 23 13 20C13 16.5 16 14 19 14.5C20 12 22.5 10 25.5 10C29 10 32 12.5 32.5 16C35 16 37 18 37 21C37 23.5 35 25 33 25"
            fill="url(#hatGradient)"
          />
          {/* Hat Pleats / Body */}
          <path
            d="M16 25L17.5 33H32.5L34 25H16Z"
            fill="url(#hatGradient)"
          />
          {/* Stylized Crisp Steam Cutout */}
          <path
            d="M21 21C21 18 24 17 24 15"
            stroke="#121212"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M27 22C27 20 29 19 29 17.5"
            stroke="#121212"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hat Brim / Headband */}
          <rect
            x="15"
            y="33"
            width="20"
            height="5"
            rx="2.5"
            fill="url(#rimGradient)"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
          {/* Signature Accent Star or Flame pip */}
          <circle cx="25" cy="35.5" r="1.2" fill="#FFF" />
        </g>
      </svg>
    </div>
  );
};

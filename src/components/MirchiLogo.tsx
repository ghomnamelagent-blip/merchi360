import React from 'react';

interface MirchiLogoProps {
  className?: string;
  size?: number;
}

export const MirchiLogo: React.FC<MirchiLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
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
          <linearGradient id="mirchiGradient" x1="12" y1="12" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFA06E" />
            <stop offset="0.4" stopColor="#FF6B35" />
            <stop offset="0.85" stopColor="#E0320A" />
            <stop offset="1" stopColor="#B31D00" />
          </linearGradient>
          <linearGradient id="stemGradient" x1="22" y1="6" x2="32" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ADE80" />
            <stop offset="1" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="ringGradient" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8B5A" />
            <stop offset="0.5" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#FFAA00" />
          </linearGradient>
          <filter id="mirchiGlow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF6B35" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Outer Circular Ring with 360 Degree Orbit Effect */}
        <circle
          cx="24"
          cy="24"
          r="21.5"
          fill="#1C1C1E"
          stroke="#FF6B35"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {/* 360 Orbit Arc Accent */}
        <path
          d="M 24 3.5 A 20.5 20.5 0 1 1 5 24"
          stroke="url(#ringGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 2.5"
          fill="none"
          opacity="0.85"
        />

        {/* Stylized Mirchi (Chili Pepper) Silhouette */}
        <g filter="url(#mirchiGlow)">
          {/* Main Curved Chili Body */}
          <path
            d="M26 13C29 14 31 16 32 19C33.5 23 32 28 29 32C26 36 21 39 16 41C15 41.5 14.5 40.5 15 39.8C18 36 21 31.5 22 26C23 21 21.5 17 20 14C22 13 24 12.8 26 13Z"
            fill="url(#mirchiGradient)"
          />

          {/* Chili Calyx / Crown */}
          <path
            d="M23 14C25 12 28 12.5 30 14C29 16 26.5 16.5 24 16C23.5 15.5 23 14.8 23 14Z"
            fill="url(#stemGradient)"
          />

          {/* Stem with lively curl */}
          <path
            d="M27 13C28 10 31 8 33 8.5C31 9.5 30 11 29 13.5"
            stroke="url(#stemGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Gloss highlight along chili curve */}
          <path
            d="M26.5 18C28 21 27.5 26 25 30C23 33 20 35.5 17.5 38"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />

          {/* Mini 360 degree degree-symbol accent */}
          <circle cx="36" cy="18" r="2.2" stroke="#FF8B5A" strokeWidth="1.2" fill="none" />
        </g>
      </svg>
    </div>
  );
};

import React from 'react';

interface FishLogoProps {
  className?: string;
  size?: number;
}

export const FishLogo: React.FC<FishLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
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
          <linearGradient id="fishGradient" x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFA06E" />
            <stop offset="0.5" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#E04B14" />
          </linearGradient>
          <linearGradient id="finGradient" x1="12" y1="20" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8B5A" />
            <stop offset="1" stopColor="#C93B0A" />
          </linearGradient>
          <filter id="fishGlow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF6B35" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Outer Circular Ring with 360 Degree Aesthetic */}
        <circle
          cx="24"
          cy="24"
          r="21.5"
          fill="#1C1C1E"
          stroke="#FF6B35"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* 360 degree arc accent */}
        <path
          d="M 24 3 A 21 21 0 1 1 5 24"
          stroke="#FF8B5A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 2"
          fill="none"
          opacity="0.8"
        />

        {/* Stylized Streamlined Fish Silhouette (Machhi) */}
        <g filter="url(#fishGlow)">
          {/* Fish Body & Curved Tail */}
          <path
            d="M38 24C34 17 22 14 14 18C10 20 6 24 6 24C6 24 10 28 14 30C22 34 34 31 38 24Z"
            fill="url(#fishGradient)"
          />

          {/* Dynamic Tail Fins */}
          <path
            d="M37 24L43 17C41 21 41 27 43 31L37 24Z"
            fill="url(#finGradient)"
          />

          {/* Dorsal Fin */}
          <path
            d="M21 16C23 12 28 13 30 15C26 15.5 23 16 21 16Z"
            fill="url(#finGradient)"
          />

          {/* Ventral Fin */}
          <path
            d="M23 31.8C25 35 29 34.5 31 33C27.5 32.5 25 32 23 31.8Z"
            fill="url(#finGradient)"
          />

          {/* Subtle Gills curve */}
          <path
            d="M17 21C18.5 23 18.5 25 17 27"
            stroke="#161616"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Fish Eye */}
          <circle cx="12" cy="23" r="1.8" fill="#FFFFFF" />
          <circle cx="11.6" cy="22.7" r="0.9" fill="#121212" />

          {/* Subtle Scale Rib / Texture Lines */}
          <path
            d="M23 21C24.5 23 24.5 25 23 27"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          <path
            d="M29 22C30 23.5 30 24.5 29 26"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
};

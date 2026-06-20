'use client';
import React from 'react';

type AccentVariant = 'overlapping-squares' | 'overlapping-rectangles' | 'overlapping-circles';

interface Props {
  variant: AccentVariant;
  className?: string;
}

export default function ArchitecturalAccent({ variant, className = '' }: Props) {
  const strokeColor = "#D3AE3E";
  const strokeOpacity = "0.2"; 
  const strokeWidth = "1";

  const renderVariant = () => {
    switch (variant) {
      case 'overlapping-squares':
        return (
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="100" height="100" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <rect x="40" y="40" width="100" height="100" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <rect x="60" y="60" width="100" height="100" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            {/* Adding inner smaller squares */}
            <rect x="70" y="70" width="40" height="40" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} strokeDasharray="2 2" />
            <rect x="80" y="80" width="20" height="20" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            
            {/* Connecting lines for 3D/Blueprint look */}
            <line x1="20" y1="20" x2="60" y2="60" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            <line x1="120" y1="20" x2="160" y2="60" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            <line x1="20" y1="120" x2="60" y2="160" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            <line x1="120" y1="120" x2="160" y2="160" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            
            {/* Extension lines */}
            <line x1="160" y1="160" x2="200" y2="200" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} strokeDasharray="4 4" />
            <line x1="160" y1="60" x2="200" y2="20" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} strokeDasharray="4 4" />
          </svg>
        );
      case 'overlapping-rectangles':
        return (
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="30" width="160" height="60" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <rect x="30" y="50" width="160" height="60" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <rect x="50" y="70" width="140" height="100" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            
            {/* Vertical divisions */}
            <line x1="70" y1="30" x2="70" y2="170" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            <line x1="130" y1="30" x2="130" y2="170" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            
            {/* Horizontal divisions */}
            <line x1="10" y1="100" x2="190" y2="100" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} strokeDasharray="2 2" />
            <line x1="10" y1="140" x2="190" y2="140" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            
            {/* Corners points */}
            <circle cx="10" cy="30" r="2" fill={strokeColor} opacity={strokeOpacity} />
            <circle cx="170" cy="30" r="2" fill={strokeColor} opacity={strokeOpacity} />
            <circle cx="190" cy="50" r="2" fill={strokeColor} opacity={strokeOpacity} />
            <circle cx="190" cy="170" r="2" fill={strokeColor} opacity={strokeOpacity} />
          </svg>
        );
      case 'overlapping-circles':
        return (
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="60" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <circle cx="120" cy="80" r="60" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <circle cx="100" cy="115" r="60" stroke={strokeColor} strokeWidth={strokeWidth} opacity={strokeOpacity} />
            <circle cx="100" cy="115" r="80" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" opacity={strokeOpacity} />
            <line x1="20" y1="80" x2="180" y2="80" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
            <line x1="100" y1="20" x2="100" y2="180" stroke={strokeColor} strokeWidth="0.5" opacity={strokeOpacity} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute pointer-events-none z-0 ${className}`}>
      {renderVariant()}
    </div>
  );
}

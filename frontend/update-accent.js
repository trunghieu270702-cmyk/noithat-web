const fs = require('fs');

const arcsSvg = fs.readFileSync('arcs-svg-output.txt', 'utf8');
const buildingSvg = fs.readFileSync('building-svg-output.txt', 'utf8');

const componentCode = `'use client';
import React from 'react';

type AccentVariant = 'artistic-arcs' | 'isometric-building';

interface Props {
  variant: AccentVariant;
  className?: string;
}

export default function ArchitecturalAccent({ variant, className = '' }: Props) {
  // Màu sắc chủ đạo của nét (màu vàng nhạt)
  const strokeColor = "#D3AE3E";
  const strokeOpacity = "0.15"; // Điểm nhấn mờ và tinh tế
  const strokeWidth = "0.75";

  const renderVariant = () => {
    switch (variant) {
      case 'artistic-arcs':
        return (
          <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin slice">
            ${arcsSvg.trim().split('\\n').join('\\n            ')}
          </svg>
        );
      case 'isometric-building':
        return (
          <svg width="100%" height="100%" viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            ${buildingSvg.trim().split('\\n').join('\\n            ')}
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={\`absolute pointer-events-none z-0 \${className}\`}>
      {renderVariant()}
    </div>
  );
}
`;

fs.writeFileSync('src/app/(user)/_components/ArchitecturalAccent.tsx', componentCode);

const fs = require('fs');

// --- BRIDGE SVG ---
let bridge = '';
// Deck
bridge += '<line x1="0" y1="300" x2="800" y2="300" stroke="currentColor" stroke-width="2" />\n';
bridge += '<line x1="0" y1="320" x2="800" y2="320" stroke="currentColor" stroke-width="1" />\n';
// Truss
for(let x=0; x<800; x+=20) {
  bridge += `<polyline points="${x},300 ${x+10},320 ${x+20},300" fill="none" stroke="currentColor" stroke-width="0.5" />\n`;
}
// Towers
function drawTower(x) {
  bridge += `<line x1="${x-20}" y1="320" x2="${x-10}" y2="50" stroke="currentColor" stroke-width="2" />\n`;
  bridge += `<line x1="${x+20}" y1="320" x2="${x+10}" y2="50" stroke="currentColor" stroke-width="2" />\n`;
  // Cross bracing
  for(let y=80; y<300; y+=30) {
    let w1 = 10 + ((y-50)/270)*10;
    let w2 = 10 + ((y+30-50)/270)*10;
    bridge += `<line x1="${x-w1}" y1="${y}" x2="${x+w1}" y2="${y}" stroke="currentColor" stroke-width="1" />\n`;
    bridge += `<line x1="${x-w1}" y1="${y}" x2="${x+w2}" y2="${y+30}" stroke="currentColor" stroke-width="0.5" />\n`;
    bridge += `<line x1="${x+w1}" y1="${y}" x2="${x-w2}" y2="${y+30}" stroke="currentColor" stroke-width="0.5" />\n`;
  }
}
drawTower(200);
drawTower(600);

// Main suspension cable (parabola)
bridge += '<path d="M 0 100 Q 200 300 400 300 T 800 100" fill="none" stroke="currentColor" stroke-width="1.5" />\n';

// Suspender cables
for(let x=20; x<800; x+=20) {
  if (Math.abs(x-200) < 30 || Math.abs(x-600) < 30) continue;
  // parabola equation for y: vertex at (400, 300)
  let yCable = 300 - ((x-400)*(x-400)) / 200;
  // adjusting for side spans
  if (x < 200) {
    yCable = 50 + ((x-200)*(x-200)) / 160;
  } else if (x > 600) {
    yCable = 50 + ((x-600)*(x-600)) / 160;
  }
  
  if (yCable < 300) {
     bridge += `<line x1="${x}" y1="${yCable}" x2="${x}" y2="300" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" />\n`;
  }
}

// Background perspective lines
for(let r=1; r<5; r++) {
  bridge += `<circle cx="400" cy="300" r="${r*80}" fill="none" stroke="currentColor" stroke-width="0.2" opacity="0.3" />\n`;
}


// --- CITYSCAPE SVG ---
let city = '';
// Base line
city += '<line x1="0" y1="500" x2="800" y2="500" stroke="currentColor" stroke-width="2" />\n';

function drawBuilding(x, y, w, h, style) {
  city += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="1.5" />\n`;
  // Grid
  if(style === 'grid') {
    for(let i=10; i<w; i+=10) {
      city += `<line x1="${x+i}" y1="${y}" x2="${x+i}" y2="${y+h}" stroke="currentColor" stroke-width="0.3" />\n`;
    }
    for(let j=10; j<h; j+=15) {
      city += `<line x1="${x}" y1="${y+j}" x2="${x+w}" y2="${y+j}" stroke="currentColor" stroke-width="0.3" />\n`;
    }
  } else if (style === 'stripes') {
    for(let i=5; i<w; i+=5) {
      city += `<line x1="${x+i}" y1="${y}" x2="${x+i}" y2="${y+h}" stroke="currentColor" stroke-width="0.5" />\n`;
    }
  } else if (style === 'glass') {
    for(let i=15; i<w; i+=15) {
      city += `<line x1="${x+i}" y1="${y}" x2="${x+i}" y2="${y+h}" stroke="currentColor" stroke-width="0.5" />\n`;
    }
    for(let j=20; j<h; j+=20) {
      city += `<line x1="${x}" y1="${y+j}" x2="${x+w}" y2="${y+j}" stroke="currentColor" stroke-width="0.5" />\n`;
    }
    // reflections
    city += `<line x1="${x+5}" y1="${y+h-20}" x2="${x+w-5}" y2="${y+20}" stroke="currentColor" stroke-width="0.5" opacity="0.5" />\n`;
  }
}

// Background layer
drawBuilding(50, 250, 80, 250, 'grid');
drawBuilding(180, 200, 100, 300, 'glass');
drawBuilding(350, 150, 120, 350, 'stripes');
drawBuilding(520, 220, 90, 280, 'grid');
drawBuilding(660, 280, 70, 220, 'glass');

// Foreground layer
drawBuilding(100, 300, 60, 200, 'stripes');
drawBuilding(250, 350, 90, 150, 'grid');
drawBuilding(420, 300, 80, 200, 'glass');
drawBuilding(580, 380, 100, 120, 'stripes');

// Add some spires and roofs
city += '<polygon points="350,150 410,50 470,150" fill="none" stroke="currentColor" stroke-width="1.5" />\n';
city += '<line x1="410" y1="50" x2="410" y2="0" stroke="currentColor" stroke-width="1.5" />\n';
city += '<polygon points="180,200 230,160 280,200" fill="none" stroke="currentColor" stroke-width="1.5" />\n';


const componentCode = `'use client';
import React from 'react';

type AccentVariant = 'artistic-bridge' | 'artistic-cityscape';

interface Props {
  variant: AccentVariant;
  className?: string;
}

export default function ArchitecturalAccent({ variant, className = '' }: Props) {
  const strokeColor = "#D3AE3E";
  const strokeOpacity = "0.5"; // Increased opacity so it's clearly visible

  const renderVariant = () => {
    switch (variant) {
      case 'artistic-bridge':
        return (
          <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" style={{ color: strokeColor, opacity: strokeOpacity }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            ${bridge.trim().split('\\n').join('\\n            ')}
          </svg>
        );
      case 'artistic-cityscape':
        return (
          <svg width="100%" height="100%" viewBox="0 0 800 550" fill="none" style={{ color: strokeColor, opacity: strokeOpacity }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            ${city.trim().split('\\n').join('\\n            ')}
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
console.log('Done generating art');

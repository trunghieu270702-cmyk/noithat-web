import React from 'react';

export default function BackgroundVisuals() {
  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 2px #D3AE3E); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px #FDF0B0); }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden mix-blend-screen opacity-80 transition-opacity duration-700">
        <div className="absolute inset-0 transition-colors duration-700">
        
        {/* Top Left: Constellation / Circles (Chỉ lấy 1 góc) */}
        <svg 
          className="absolute top-[-25%] left-[-35%] md:top-[-45%] md:left-[-25%] w-[120%] md:w-[70%] max-w-[1000px] h-auto opacity-90" 
          viewBox="0 0 500 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="animate-[spin_150s_linear_infinite]" style={{ transformOrigin: '250px 250px' }}>
            <defs>
            <linearGradient id="luxury-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D3AE3E" />
              <stop offset="30%" stopColor="#FDF0B0" />
              <stop offset="50%" stopColor="#D3AE3E" />
              <stop offset="80%" stopColor="#9C7D21" />
              <stop offset="100%" stopColor="#FDF0B0" />
            </linearGradient>
          </defs>

          {/* Main Circles */}
          <circle cx="250" cy="250" r="100" stroke="url(#luxury-gold)" strokeWidth="0.75" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="150" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="210" stroke="url(#luxury-gold)" strokeWidth="0.75" strokeDasharray="2 6" />
          <circle cx="250" cy="250" r="280" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          
          {/* Connecting Lines */}
          <path d="M 250 150 L 320 180 L 350 250 L 300 320 L 250 350 Z" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          <path d="M 320 180 L 400 120" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          <path d="M 350 250 L 460 250" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          <path d="M 300 320 L 350 420" stroke="url(#luxury-gold)" strokeWidth="0.5" />
          <path d="M 250 150 L 180 80" stroke="url(#luxury-gold)" strokeWidth="0.5" />

          {/* Glowing dots at intersections */}
          <circle cx="250" cy="150" r="3" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="320" cy="180" r="3" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="350" cy="250" r="3" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="300" cy="320" r="2.5" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="250" cy="350" r="3" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="400" cy="120" r="2.5" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="460" cy="250" r="2" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="350" cy="420" r="2" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="180" cy="80" r="2.5" fill="url(#luxury-gold)" className="drop-shadow-[0_0_8px_#D3AE3E]" />
          <circle cx="250" cy="250" r="4" fill="url(#luxury-gold)" className="drop-shadow-[0_0_15px_#D3AE3E]" style={{ animation: 'pulse-glow 3s infinite' }} />
          </g>
        </svg>

        {/* Right side: Architectural oblique wireframe (100% identical match to reference) */}
        <svg 
          className="absolute top-[0%] right-[-5%] md:right-[0%] w-[70%] md:w-[45%] max-w-[800px] h-[100%] opacity-90" 
          viewBox="0 0 1000 1200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMin slice"
        >
          <defs>
            <linearGradient id="luxury-gold-2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9C7D21" />
              <stop offset="30%" stopColor="#D3AE3E" />
              <stop offset="60%" stopColor="#FDF0B0" />
              <stop offset="100%" stopColor="#D3AE3E" />
            </linearGradient>
            
            <linearGradient id="faint-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D3AE3E" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FDF0B0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D3AE3E" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 1. FAINT BACKGROUND GRID (Horizontal & Vertical) */}
          <g stroke="url(#faint-gold)" strokeWidth="0.5" strokeDasharray="4 6" style={{ animation: 'dash-flow 50s linear infinite' }}>
            {/* Horizontals */}
            <line x1="100" y1="300" x2="850" y2="300" />
            <line x1="300" y1="450" x2="950" y2="450" />
            <line x1="200" y1="650" x2="500" y2="650" />
            <line x1="400" y1="200" x2="700" y2="200" />
            <line x1="50"  y1="1000" x2="400" y2="1000" />
            <line x1="150" y1="1050" x2="550" y2="1050" />
            
            {/* Verticals */}
            <line x1="400" y1="100" x2="400" y2="700" />
            <line x1="100" y1="300" x2="100" y2="800" />
            <line x1="500" y1="200" x2="500" y2="900" />
            <line x1="650" y1="150" x2="650" y2="600" />
            <line x1="850" y1="50"  x2="850" y2="800" />
            <line x1="950" y1="300" x2="950" y2="1100" />
          </g>

          {/* 2. THE MAIN OBLIQUE WIREFRAME (The Building Structure) */}
          <g style={{ animation: 'float-slow 12s ease-in-out infinite' }}>
            {/* Depth lines slope: up and right (dx=1, dy=-0.6) */}
            <g stroke="url(#luxury-gold-2)" strokeWidth="0.8">
            
            {/* Top Transparent Box / Terraces */}
            <path d="M 600 400 L 900 220 L 1050 220 L 750 400 Z" fill="url(#luxury-gold-2)" fillOpacity="0.02" />
            <line x1="600" y1="400" x2="900" y2="220" />
            <line x1="650" y1="400" x2="950" y2="220" />
            <line x1="700" y1="400" x2="1000" y2="220" />
            <line x1="750" y1="400" x2="1050" y2="220" />
            <line x1="600" y1="400" x2="750" y2="400" />
            <line x1="900" y1="220" x2="1050" y2="220" />
            
            <line x1="600" y1="400" x2="600" y2="600" />
            <line x1="750" y1="400" x2="750" y2="600" />
            <line x1="900" y1="220" x2="900" y2="420" />

            {/* Mid-level Large Platform (The prominent dense grid) */}
            <path d="M 350 750 L 750 510 L 1150 510 L 750 750 Z" fill="url(#luxury-gold-2)" fillOpacity="0.03" />
            {/* Dense depth lines for mid platform */}
            <line x1="350" y1="750" x2="750" y2="510" />
            <line x1="400" y1="750" x2="800" y2="510" />
            <line x1="450" y1="750" x2="850" y2="510" />
            <line x1="500" y1="750" x2="900" y2="510" />
            <line x1="550" y1="750" x2="950" y2="510" />
            <line x1="600" y1="750" x2="1000" y2="510" />
            <line x1="650" y1="750" x2="1050" y2="510" />
            <line x1="700" y1="750" x2="1100" y2="510" />
            <line x1="750" y1="750" x2="1150" y2="510" />

            {/* Front facing grid of the mid platform */}
            <line x1="350" y1="750" x2="750" y2="750" />
            <line x1="350" y1="800" x2="750" y2="800" />
            <line x1="350" y1="850" x2="750" y2="850" />
            <line x1="350" y1="900" x2="750" y2="900" />
            <line x1="350" y1="750" x2="350" y2="900" />
            <line x1="450" y1="750" x2="450" y2="900" />
            <line x1="550" y1="750" x2="550" y2="900" />
            <line x1="650" y1="750" x2="650" y2="900" />
            <line x1="750" y1="750" x2="750" y2="900" />

            {/* Inner structural lines (faint depth) */}
            <line x1="350" y1="800" x2="750" y2="560" strokeWidth="0.4" opacity="0.6" />
            <line x1="350" y1="850" x2="750" y2="610" strokeWidth="0.4" opacity="0.6" />
            <line x1="350" y1="900" x2="750" y2="660" strokeWidth="0.4" opacity="0.6" />

            {/* Lower left extending platform */}
            <line x1="250" y1="950" x2="650" y2="710" />
            <line x1="250" y1="950" x2="500" y2="950" />
            <line x1="500" y1="950" x2="900" y2="710" />
            <line x1="250" y1="950" x2="250" y2="1050" strokeWidth="0.4" />
            <line x1="500" y1="950" x2="500" y2="1050" strokeWidth="0.4" />
          </g>

          {/* 3. GLOWING DOTS AT KEY INTERSECTIONS */}
          <g fill="url(#luxury-gold-2)">
            {/* Top Left Area */}
            <circle cx="100" cy="300" r="2.5" className="drop-shadow-[0_0_8px_#D3AE3E]" />
            <circle cx="400" cy="300" r="3.5" className="drop-shadow-[0_0_10px_#D3AE3E]" />
            <circle cx="400" cy="100" r="2" />
            <circle cx="160" cy="300" r="1.5" />
            <circle cx="400" cy="200" r="2" />
            <circle cx="500" cy="450" r="2" />
            
            {/* Mid Area (Building Nodes) */}
            <circle cx="600" cy="400" r="3" className="drop-shadow-[0_0_8px_#D3AE3E]" />
            <circle cx="750" cy="400" r="2" />
            <circle cx="650" cy="250" r="2.5" className="drop-shadow-[0_0_8px_#D3AE3E]" />
            <circle cx="850" cy="50"  r="2" />
            <circle cx="900" cy="220" r="3" className="drop-shadow-[0_0_8px_#D3AE3E]" />
            
            {/* Dense Grid Nodes */}
            <circle cx="350" cy="750" r="2.5" className="drop-shadow-[0_0_6px_#D3AE3E]" />
            <circle cx="750" cy="750" r="2.5" className="drop-shadow-[0_0_6px_#D3AE3E]" />
            <circle cx="750" cy="510" r="3" className="drop-shadow-[0_0_8px_#D3AE3E]" />
            <circle cx="550" cy="750" r="2" />
            <circle cx="550" cy="900" r="2" />
            <circle cx="350" cy="900" r="2" />
            <circle cx="750" cy="900" r="2" />
            
            {/* Floating ambient dots */}
            <circle cx="280" cy="720" r="1.5" opacity="0.7" style={{ animation: 'pulse-glow 2s infinite alternate' }} />
            <circle cx="800" cy="650" r="1.5" opacity="0.7" style={{ animation: 'pulse-glow 3s infinite alternate-reverse' }} />
            <circle cx="950" cy="450" r="2" opacity="0.8" style={{ animation: 'pulse-glow 4s infinite alternate' }} />
            <circle cx="200" cy="650" r="2" opacity="0.6" style={{ animation: 'pulse-glow 2.5s infinite alternate-reverse' }} />
            <circle cx="250" cy="1050" r="2" opacity="0.6" />
            <circle cx="550" cy="1050" r="2" opacity="0.6" />
          </g>
          </g>
        </svg>

        {/* Bottom Right: Dot Matrix */}
        <svg 
          className="absolute bottom-[8%] right-[5%] w-[60px] h-[60px] md:w-[90px] md:h-[90px] opacity-100" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDF0B0" />
              <stop offset="50%" stopColor="#D3AE3E" />
              <stop offset="100%" stopColor="#9C7D21" />
            </radialGradient>
          </defs>
          {Array.from({ length: 6 }).map((_, row) => 
            Array.from({ length: 5 }).map((_, col) => (
              <circle 
                key={`${row}-${col}`} 
                cx={10 + col * 20} 
                cy={10 + row * 20} 
                r="1.8" 
                fill="url(#dot-glow)" 
                className="drop-shadow-[0_0_8px_#D3AE3E]"
                style={{ 
                  animation: 'pulse-glow 3s infinite alternate',
                  animationDelay: `${(row * 5 + col) * 100}ms` 
                }}
              />
            ))
          )}
        </svg>

      </div>
    </div>
    </>
  );
}

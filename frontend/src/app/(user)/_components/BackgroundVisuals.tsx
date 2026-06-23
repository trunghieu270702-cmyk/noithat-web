import React, { useMemo, useState, useEffect } from 'react';

interface BackgroundVisualsProps {
  mouseX?: number;
  mouseY?: number;
}

export default function BackgroundVisuals({ mouseX = 0, mouseY = 0 }: BackgroundVisualsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sinh random particles với các lớp chiều sâu (Parallax Z) khác nhau
  const particles = useMemo(() => {
    // Return empty array during SSR to avoid hydration mismatch
    if (!mounted) return [];
    
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 200}px`,
      ty: `${(Math.random() - 0.5) * 200 - 100}px`,
      size: Math.random() * 4 + 1.5,
      duration: `${Math.random() * 20 + 30}s`, // 30s - 50s
      delay: `-${Math.random() * 30}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      parallaxZ: Math.random() * 120 + 30, // 30px đến 150px
      opacity: Math.random() * 0.6 + 0.2, // 0.2 đến 0.8
    }));
  }, [mounted]);

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      
      {/* Bỏ mix-blend-screen để luôn hiển thị rõ nét trên cả nền Light Mode (màu sáng) và Dark Mode. Nâng opacity tổng thể. */}
      <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden opacity-90 transition-opacity duration-700">
        
        {/* --- GOLD LIGHT EFFECT (Ánh sáng mờ chiếu chéo) --- */}
        <div 
          className="absolute inset-[-20%] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(211,174,62,0.15) 0%, rgba(211,174,62,0.03) 40%, transparent 60%, transparent 100%)',
            filter: 'blur(90px)',
            transform: `translate(${mouseX * 5}px, ${mouseY * 5}px)`
          }}
        />

        {/* --- MULTI-DEPTH LUXURY PARTICLES (Hạt bụi ánh kim đa lớp) --- */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => {
            // Giảm số lượng hạt trên mobile và tablet bằng CSS breakpoints
            let visibilityClass = '';
            if (i >= 40) visibilityClass = 'hidden lg:block';
            else if (i >= 15) visibilityClass = 'hidden md:block';

            return (
              <div 
                key={p.id}
                className={`absolute ${visibilityClass}`}
                style={{
                  left: p.left,
                  top: p.top,
                  opacity: p.opacity,
                  transform: `translate(${mouseX * p.parallaxZ}px, ${mouseY * p.parallaxZ}px)`
                }}
              >
                {/* Animation transform và parallax transform cần tách ra 2 thẻ div để không bị ghi đè */}
                <div 
                  className="luxury-particle !relative !left-0 !top-0"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    '--tx': p.tx,
                    '--ty': p.ty,
                    '--duration': p.duration,
                    '--delay': p.delay,
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>

        {/* Top Right: Luxury Architectural Compass / Grid Node */}
        <div 
          className="absolute top-[5%] right-[5%] w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[250px] lg:h-[250px] opacity-90" 
          style={{ 
            animation: 'float-slow 8s ease-in-out infinite',
            transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)`
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            
            {/* Background Grid - Parallax lớp chìm (-10px) */}
            <g style={{ transform: `translate(${mouseX * -10}px, ${mouseY * -10}px)` }}>
              <g opacity="0.4" stroke="#D3AE3E" strokeWidth="0.3">
                <line x1="36" y1="36" x2="164" y2="164" />
                <line x1="164" y1="36" x2="36" y2="164" />
              </g>
              <circle cx="100" cy="100" r="55" stroke="#D3AE3E" strokeWidth="0.2" opacity="0.3" />
            </g>

            {/* Main Compass Rings - Parallax lớp giữa (0px) */}
            <g style={{ transformOrigin: '100px 100px', animation: 'spin-slow 120s linear infinite' }}>
              <circle cx="100" cy="100" r="80" stroke="#D3AE3E" strokeWidth="0.5" strokeDasharray="2 6" />
              <circle cx="100" cy="100" r="90" stroke="#D3AE3E" strokeWidth="0.2" opacity="0.5" />
            </g>
            <circle cx="100" cy="100" r="60" stroke="#D3AE3E" strokeWidth="0.5" opacity="0.7" />

            {/* Front Crosshairs & Text - Parallax lớp nổi (+15px) */}
            <g style={{ transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)` }}>
              <line x1="100" y1="10" x2="100" y2="190" stroke="#D3AE3E" strokeWidth="0.5" opacity="0.6" />
              <line x1="10" y1="100" x2="190" y2="100" stroke="#D3AE3E" strokeWidth="0.5" opacity="0.6" />
              <circle cx="100" cy="100" r="2.5" fill="#D3AE3E" className="drop-shadow-[0_0_5px_#D3AE3E]" style={{ animation: 'pulse-subtle 3s infinite' }} />
              <text x="105" y="45" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono" opacity="0.9" fontWeight="bold">N 45°</text>
              <text x="105" y="160" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono" opacity="0.9" fontWeight="bold">S 45°</text>
              <text x="165" y="95" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono" opacity="0.9" fontWeight="bold">E</text>
              <text x="30" y="95" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono" opacity="0.9" fontWeight="bold">W</text>
            </g>

          </svg>
        </div>

        {/* Bottom Left: Subtle Blueprint Crosshairs & Scale */}
        <div 
          className="absolute bottom-[8%] left-[5%] w-[180px] h-[100px] opacity-80 hidden lg:block"
          style={{ transform: `translate(${mouseX * -5}px, ${mouseY * -5}px)` }}
        >
          <svg viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 20 80 L 20 20 L 160 20" stroke="#D3AE3E" strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1="18" x2="50" y2="22" stroke="#D3AE3E" strokeWidth="0.5" />
            <line x1="80" y1="18" x2="80" y2="22" stroke="#D3AE3E" strokeWidth="0.5" />
            <line x1="110" y1="18" x2="110" y2="22" stroke="#D3AE3E" strokeWidth="0.5" />
            <line x1="140" y1="18" x2="140" y2="22" stroke="#D3AE3E" strokeWidth="0.5" />
            <line x1="18" y1="50" x2="22" y2="50" stroke="#D3AE3E" strokeWidth="0.5" />
            <text x="15" y="15" fill="#D3AE3E" fontSize="8" className="font-mono drop-shadow-[0_0_2px_#D3AE3E]" opacity="0.9" fontWeight="bold">+</text>
            <text x="140" y="15" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono font-bold drop-shadow-[0_0_2px_#D3AE3E]" opacity="0.8">1:100 SCALE</text>
            <text x="25" y="52" fill="#D3AE3E" fontSize="6" letterSpacing="1" className="font-mono font-bold drop-shadow-[0_0_2px_#D3AE3E]" opacity="0.8">ELEVATION</text>
            <circle cx="20" cy="20" r="1.5" fill="#D3AE3E" className="drop-shadow-[0_0_3px_#D3AE3E]" />
            <circle cx="160" cy="20" r="1" fill="#D3AE3E" opacity="0.5" />
            <circle cx="20" cy="80" r="1" fill="#D3AE3E" opacity="0.5" />
          </svg>
        </div>

        {/* Left Side: Architectural Blueprint Sketch (True 3D Parallax & Tech Styling) */}
        <div 
          className="absolute bottom-[2%] left-[2%] md:left-[5%] w-[220px] md:w-[320px] h-[40%] pointer-events-none hidden lg:block" 
          style={{ 
            opacity: 0.6,
            animation: 'float-slow 20s ease-in-out infinite alternate-reverse',
            // Base layer movement
            transform: `translate(${mouseX * 5}px, ${mouseY * 5}px)`
          }}
        >
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
            
            {/* LAYER 1: Deep Background Grid (Moves Opposite) */}
            <g stroke="#D3AE3E" strokeWidth="0.1" opacity="0.2" style={{ transform: `translate(${mouseX * -15}px, ${mouseY * -15}px)` }}>
              <path d="M 50 50 L 350 50 M 50 100 L 350 100 M 50 150 L 350 150 M 50 200 L 350 200 M 50 250 L 350 250 M 50 300 L 350 300 M 50 350 L 350 350" strokeDasharray="2 2" />
              <path d="M 50 50 L 50 350 M 100 50 L 100 350 M 150 50 L 150 350 M 200 50 L 200 350 M 250 50 L 250 350 M 300 50 L 300 350 M 350 50 L 350 350" strokeDasharray="2 2" />
              
              {/* Spinning Radar Background */}
              <g style={{ transformOrigin: '200px 200px', animation: 'spin-slow 20s linear infinite' }}>
                <circle cx="200" cy="200" r="120" strokeWidth="0.2" strokeDasharray="5 15" />
                <line x1="80" y1="200" x2="320" y2="200" strokeWidth="0.2" opacity="0.5" />
                <line x1="200" y1="80" x2="200" y2="320" strokeWidth="0.2" opacity="0.5" />
              </g>
            </g>

            {/* LAYER 2: Main Structural Outline (Static/Base Parallax) */}
            <g stroke="#D3AE3E" opacity="0.7">
              <path d="M 100 280 L 100 150 L 220 90 L 320 140 L 320 270 L 200 330 Z" strokeWidth="1.2" />
              <path d="M 100 150 L 200 200 L 320 140" strokeWidth="0.8" opacity="0.8" strokeDasharray="4 2" />
              <path d="M 200 200 L 200 330" strokeWidth="0.8" opacity="0.8" strokeDasharray="4 2" />
            </g>

            {/* LAYER 3: Inner Wireframe & Dimensions (Moves Forward) */}
            <g stroke="#D3AE3E" style={{ transform: `translate(${mouseX * 12}px, ${mouseY * 12}px)` }}>
              {/* Inner details */}
              <path d="M 120 265 L 120 165 L 190 200 L 190 300 Z" strokeWidth="0.4" opacity="0.5" />
              <path d="M 210 305 L 210 205 L 300 160 L 300 260 Z" strokeWidth="0.4" opacity="0.5" />
              <path d="M 130 145 L 210 105 L 290 145 L 210 185 Z" strokeWidth="0.4" opacity="0.5" />

              {/* Dimension Lines */}
              <line x1="80" y1="280" x2="80" y2="150" strokeDasharray="2 2" strokeWidth="0.5" />
              <line x1="75" y1="280" x2="85" y2="280" strokeWidth="1" />
              <line x1="75" y1="150" x2="85" y2="150" strokeWidth="1" />
              <line x1="100" y1="310" x2="200" y2="360" strokeDasharray="2 2" strokeWidth="0.5" />
              <line x1="95" y1="300" x2="105" y2="320" strokeWidth="1" />
              <line x1="195" y1="350" x2="205" y2="370" strokeWidth="1" />

              {/* Floating Data Labels */}
              <g fill="#D3AE3E" fontSize="9" className="font-mono drop-shadow-[0_0_2px_#D3AE3E]" letterSpacing="1">
                <text x="70" y="225" transform="rotate(-90 70 225)" fontWeight="bold">ELEV: 14.50m</text>
                <text x="140" y="355" transform="rotate(26.5 140 355)" fontWeight="bold">SPAN: 24.00m</text>
                
                {/* Data Block Top Left */}
                <rect x="50" y="30" width="90" height="40" fill="none" stroke="#D3AE3E" strokeWidth="0.4" />
                <text x="55" y="42" fontWeight="bold">PROJ: L-NEXUS</text>
                <text x="55" y="52" fontSize="7">VOL: 4,520m³</text>
                <text x="55" y="60" fontSize="7">AREA: 820m²</text>
                <text x="55" y="68" fontSize="7">MAT: STEEL/GLASS</text>
                <line x1="140" y1="50" x2="220" y2="90" strokeWidth="0.3" strokeDasharray="2 2" />
              </g>
            </g>

            {/* LAYER 4: High-Tech Nodes & Front UI (Moves Fastest, Most Parallax) */}
            <g style={{ transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)` }}>
              {/* Measurement Nodes with Glow */}
              <circle cx="200" cy="200" r="3" fill="#D3AE3E" className="drop-shadow-[0_0_8px_#D3AE3E]" style={{ animation: 'pulse-subtle 2s infinite' }} />
              <circle cx="220" cy="90" r="2.5" fill="#D3AE3E" className="drop-shadow-[0_0_5px_#D3AE3E]" />
              <circle cx="320" cy="270" r="2.5" fill="#D3AE3E" className="drop-shadow-[0_0_5px_#D3AE3E]" />
              <circle cx="100" cy="150" r="2.5" fill="#FFFFFF" className="drop-shadow-[0_0_5px_#FFFFFF]" />
              
              <g fill="#D3AE3E" fontSize="9" className="font-mono drop-shadow-[0_0_3px_#D3AE3E]" letterSpacing="1">
                <text x="90" y="140" fontWeight="bold" fill="#FFFFFF">NODE A1</text>
                <text x="90" y="150" fontSize="7" opacity="0.8">X:12.4 Y:0.0</text>
                
                <text x="230" y="85" fontWeight="bold">NODE B2</text>
                <text x="330" y="275" fontWeight="bold">NODE C3</text>
                
                <text x="208" y="200" fontWeight="bold" fill="#FFFFFF">CENTER MASS</text>
                
                {/* Data Block Bottom Right */}
                <rect x="270" y="350" width="85" height="45" fill="none" stroke="#D3AE3E" strokeWidth="0.4" />
                <text x="275" y="362" fontWeight="bold">DATE: 2026</text>
                <text x="275" y="372" fontSize="7">REV: 04.B</text>
                <text x="275" y="380" fontSize="7">SCALE: 1:100</text>
                <text x="275" y="388" fontSize="7">DRW: ARCH-01</text>
                
                {/* Small sensor data blocks */}
                <rect x="330" y="160" width="55" height="40" fill="none" stroke="#D3AE3E" strokeWidth="0.4" />
                <text x="335" y="172" fontSize="6">S1: 12% ACT</text>
                <text x="335" y="180" fontSize="6">S2: 45% NOM</text>
                <text x="335" y="188" fontSize="6">WIND: 15km/h</text>
                <text x="335" y="196" fontSize="6" fill="#FFFFFF">STR: STABLE</text>
                <line x1="330" y1="180" x2="320" y2="270" strokeWidth="0.3" strokeDasharray="1 3" stroke="#D3AE3E" />
              </g>
            </g>

          </svg>
        </div>

      </div>
    </>
  );
}

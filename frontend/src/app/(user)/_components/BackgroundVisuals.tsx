import React, { useMemo } from 'react';

interface BackgroundVisualsProps {
  mouseX?: number;
  mouseY?: number;
}

export default function BackgroundVisuals({ mouseX = 0, mouseY = 0 }: BackgroundVisualsProps) {
  // Sinh random particles với các lớp chiều sâu (Parallax Z) khác nhau
  const particles = useMemo(() => {
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
  }, []);

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

        {/* Left Side: Ultra-Detailed CAD Blueprint Cantilever (Bản vẽ 3D chi tiết cao) */}
        <div 
          className="absolute bottom-[2%] left-[-5%] md:left-[2%] w-[350px] md:w-[550px] h-[70%] pointer-events-none hidden lg:block" 
          style={{ 
            opacity: 0.35, // Tăng nhẹ opacity để rõ hơn trong Light Mode
            animation: 'float-slow 20s ease-in-out infinite alternate-reverse',
            // Main container parallax
            transform: `translate(${mouseX * 10}px, ${mouseY * 10}px)`
          }}
        >
          <svg viewBox="-50 0 550 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
            <g stroke="#D3AE3E">
              {(() => {
                const dx = 50; 
                const dy = -25; 
                
                const frontLines = [];
                const depthNodes = [];

                const yLower = [220, 240, 260, 280, 300];
                const xLower = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360];
                yLower.forEach(y => frontLines.push({ x1: 0, y1: y, x2: 360, y2: y, w: (y===220 || y===300) ? 0.8 : 0.15 }));
                xLower.forEach(x => frontLines.push({ x1: x, y1: 220, x2: x, y2: 300, w: (x===0) ? 0.8 : 0.15 }));

                const yUpper = [140, 160, 180];
                const xUpper = [80, 120, 160, 200, 240, 280, 320, 360];
                yUpper.forEach(y => frontLines.push({ x1: 80, y1: y, x2: 360, y2: y, w: (y===140 || y===180) ? 0.8 : 0.15 }));
                xUpper.forEach(x => frontLines.push({ x1: x, y1: 140, x2: x, y2: 180, w: (x===80) ? 0.8 : 0.15 }));

                // 3. VERTICAL CONNECTORS & X-BRACING (Cột dọc & Hệ giằng chéo không gian)
                const pillarsX = [120, 160, 200, 240, 280, 320, 360];
                pillarsX.forEach(x => {
                  frontLines.push({ x1: x, y1: 180, x2: x, y2: 220, w: 0.5 });
                  frontLines.push({ x1: x-10, y1: 180, x2: x-10, y2: 220, w: 0.15 }); 
                });
                
                // --- THÊM NHIỀU CHI TIẾT X-BRACING ---
                for (let i = 0; i < pillarsX.length - 1; i++) {
                  const x1 = pillarsX[i];
                  const x2 = pillarsX[i+1];
                  // Giằng chéo X giữa 2 dầm ngang
                  frontLines.push({ x1: x1, y1: 180, x2: x2, y2: 220, w: 0.1 });
                  frontLines.push({ x1: x1, y1: 220, x2: x2, y2: 180, w: 0.1 });
                }

                // 4. MAIN PILLAR TOWER & COMPLEX TOWER BRACING
                const xPillar = [260, 280, 300, 320, 340, 360];
                xPillar.forEach(x => frontLines.push({ x1: x, y1: 40, x2: x, y2: 540, w: (x===260 || x===360) ? 0.8 : 0.15 }));
                for(let y=40; y<=540; y+=40) {
                  frontLines.push({ x1: 260, y1: y, x2: 360, y2: y, w: (y===40 || y===540) ? 0.8 : 0.15 });
                  
                  // --- THÊM HỆ GIẰNG CHÉO X CHO THÁP ---
                  if (y < 540) {
                    frontLines.push({ x1: 260, y1: y, x2: 360, y2: y+40, w: 0.1 });
                    frontLines.push({ x1: 260, y1: y+40, x2: 360, y2: y, w: 0.1 });
                    
                    // Giằng chéo nhỏ hơn bên trong tháp
                    frontLines.push({ x1: 280, y1: y, x2: 340, y2: y+40, w: 0.05 });
                    frontLines.push({ x1: 280, y1: y+40, x2: 340, y2: y, w: 0.05 });
                  }
                }

                [40, 120, 200, 280].forEach(x => {
                  frontLines.push({ x1: x, y1: 300, x2: x, y2: 380, w: 0.15 }); 
                });
                [160, 240, 320].forEach(x => {
                  frontLines.push({ x1: x, y1: 40, x2: x, y2: 140, w: 0.15 }); 
                });

                yLower.forEach(y => xLower.forEach(x => depthNodes.push([x, y])));
                yUpper.forEach(y => xUpper.forEach(x => depthNodes.push([x, y])));
                for(let y=40; y<=540; y+=40) xPillar.forEach(x => depthNodes.push([x, y]));

                const uniqueDepthNodes = Array.from(new Set(depthNodes.map(n => n.join(',')))).map(s => s.split(',').map(Number));

                const outerCorners = new Set([
                  '0,220', '0,300', 
                  '80,140', '80,180',
                  '260,40', '360,40',
                  '260,540', '360,540'
                ]);

                return (
                  <>
                    {/* --- MẶT SAU (BACK FACE) - Parallax lùi (-15px) tạo 3D Perspective --- */}
                    <g opacity="0.25" style={{ transform: `translate(${mouseX * -15}px, ${mouseY * -15}px)` }}>
                      {frontLines.map((l, i) => (
                        <line key={`bh-${i}`} x1={l.x1 + dx} y1={l.y1 + dy} x2={l.x2 + dx} y2={l.y2 + dy} strokeWidth={l.w * 0.8} />
                      ))}
                      
                      {/* VÒNG CUNG NEO (ARC ANCHORS - MẶT SAU) */}
                      <path d="M 0 300 Q 130 500 260 540" fill="none" strokeWidth="0.8" />
                      <path d="M 80 140 Q 170 -20 260 40" fill="none" strokeWidth="0.8" />
                      {/* Nét đứt trang trí vòm */}
                      <path d="M 0 300 Q 130 480 260 540" fill="none" strokeWidth="0.3" strokeDasharray="4 4" />
                    </g>

                    {/* --- LƯỚI CHIỀU SÂU (DEPTH MESH) - Parallax trung gian (0px) --- */}
                    <g>
                      {uniqueDepthNodes.map(([x, y], i) => {
                        const isOuter = outerCorners.has(`${x},${y}`);
                        return (
                          <line 
                            key={`d-${i}`} 
                            x1={x + (mouseX * 15)} y1={y + (mouseY * 15)} 
                            x2={x + dx + (mouseX * -15)} y2={y + dy + (mouseY * -15)} 
                            strokeWidth={isOuter ? 0.6 : 0.15} 
                            opacity={isOuter ? 0.9 : 0.3} 
                          />
                        );
                      })}
                    </g>

                    {/* --- MẶT TRƯỚC (FRONT FACE) - Parallax tiến (+15px) --- */}
                    <g opacity="1" style={{ transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)` }}>
                      {frontLines.map((l, i) => (
                        <line key={`fh-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.w} />
                      ))}
                      
                      {/* VÒNG CUNG NEO (ARC ANCHORS - MẶT TRƯỚC) */}
                      <path d="M 0 300 Q 130 500 260 540" fill="none" strokeWidth="1.2" />
                      <path d="M 80 140 Q 170 -20 260 40" fill="none" strokeWidth="1.2" />
                      <path d="M 0 300 Q 130 480 260 540" fill="none" strokeWidth="0.3" strokeDasharray="4 4" />
                      <path d="M 80 140 Q 170 0 260 40" fill="none" strokeWidth="0.3" strokeDasharray="4 4" />
                      
                      {/* Cáp treo (Suspension cables) */}
                      <line x1="160" y1="220" x2="160" y2="445" strokeWidth="0.15" />
                      <line x1="80" y1="220" x2="80" y2="385" strokeWidth="0.15" />
                      <line x1="200" y1="180" x2="200" y2="25" strokeWidth="0.15" />
                      <line x1="120" y1="180" x2="120" y2="85" strokeWidth="0.15" />
                    </g>
                  </>
                );
              })()}
            </g>

            {/* --- DIMENSION LINES & DRAFTING COORDINATES - Lớp ngoài cùng (+25px) --- */}
            <g stroke="#D3AE3E" fill="#D3AE3E" strokeWidth="0.4" fontSize="9" fontFamily="monospace" opacity="0.8" style={{ transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)` }}>
              <line x1="0" y1="580" x2="260" y2="580" />
              <line x1="0" y1="575" x2="0" y2="585" strokeWidth="0.8" />
              <line x1="260" y1="575" x2="260" y2="585" strokeWidth="0.8" />
              <text x="130" y="575" textAnchor="middle" fontWeight="bold">W-CANTILEVER: 24.0m</text>
              <line x1="410" y1="40" x2="410" y2="540" />
              <line x1="405" y1="40" x2="415" y2="40" strokeWidth="0.8" />
              <line x1="405" y1="540" x2="415" y2="540" strokeWidth="0.8" />
              <text x="420" y="290" style={{ writingMode: 'vertical-rl' }} fontWeight="bold">ELEVATION: H-50.0m</text>
              <g opacity="1">
                <path d="M -20 220 L 10 220 M 0 205 L 0 235" strokeWidth="0.5" />
                <text x="-5" y="215" textAnchor="end" fontSize="8" fontWeight="bold">NODE: A-11</text>
                <text x="-5" y="235" textAnchor="end" fontSize="7" opacity="0.9">X:-24.0 Y:+12.0 Z:0.0</text>
              </g>
              <g opacity="1">
                <path d="M 245 40 L 275 40 M 260 25 L 260 55" strokeWidth="0.5" />
                <text x="275" y="35" fontSize="8" fontWeight="bold">APEX T-1</text>
                <text x="275" y="50" fontSize="7" opacity="0.9">ELEV +54.00</text>
              </g>
              <g opacity="1">
                <path d="M 145 180 L 175 180 M 160 165 L 160 195" strokeWidth="0.5" />
                <text x="175" y="175" fontSize="8" fontWeight="bold">JT-8X</text>
                <text x="175" y="190" fontSize="7" opacity="0.9">Fz: 450kN</text>
              </g>
            </g>

            {/* VẼ VÀI ĐIỂM SÁNG NỔI BẬT ĐỂ TẠO KHỐI (GLOWING NODES) - Lớp nổi (+15px) theo Front Face */}
            <g fill="#FFFFFF" style={{ transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)` }}>
              <circle cx={260} cy={220} r="3.5" className="drop-shadow-[0_0_8px_#FFFFFF]" style={{ animation: 'pulse-subtle 2s infinite' }} />
              <circle cx={360} cy={220} r="2.5" className="drop-shadow-[0_0_6px_#D3AE3E]" />
              <circle cx={0} cy={220} r="2.5" />
              <circle cx={0} cy={300} r="2" />
              <circle cx={80} cy={140} r="2.5" className="drop-shadow-[0_0_6px_#FFFFFF]" />
              <circle cx={80} cy={180} r="2" />
              <circle cx={360} cy={520} r="3" className="drop-shadow-[0_0_8px_#FFFFFF]" />
              <circle cx={260} cy={40} r="2" opacity="0.8" />
              <circle cx={260+50} cy={220-25} r="2.5" fill="#D3AE3E" opacity="0.8" />
            </g>
          </svg>
        </div>

      </div>
    </>
  );
}

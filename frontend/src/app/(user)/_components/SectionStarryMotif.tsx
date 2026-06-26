'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CONSTELLATIONS = [
  // 1. Ursa Major (Big Dipper)
  <g key="ursa-major" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="20%" y1="30%" x2="35%" y2="50%" />
    <line x1="35%" y1="50%" x2="25%" y2="70%" />
    <line x1="25%" y1="70%" x2="50%" y2="80%" />
    <line x1="50%" y1="80%" x2="60%" y2="60%" />
    <line x1="60%" y1="60%" x2="35%" y2="50%" />
    <line x1="60%" y1="60%" x2="80%" y2="55%" />
    <circle cx="20%" cy="30%" r="2" fill="currentColor" opacity="0.8" className="animate-[pulse_4s_ease-in-out_infinite]" />
    <circle cx="35%" cy="50%" r="2.5" fill="var(--star-white)" opacity="0.6" />
    <circle cx="25%" cy="70%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="50%" cy="80%" r="2" fill="var(--star-white)" opacity="0.5" />
    <circle cx="60%" cy="60%" r="3" fill="currentColor" opacity="0.9" className="animate-[pulse_3s_ease-in-out_infinite]" />
    <circle cx="80%" cy="55%" r="2" fill="currentColor" opacity="0.6" />
  </g>,

  // 2. Cassiopeia (W shape)
  <g key="cassiopeia" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="15%" y1="40%" x2="30%" y2="20%" />
    <line x1="30%" y1="20%" x2="50%" y2="45%" />
    <line x1="50%" y1="45%" x2="70%" y2="25%" />
    <line x1="70%" y1="25%" x2="85%" y2="50%" />
    <circle cx="15%" cy="40%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="30%" cy="20%" r="2.5" fill="var(--star-white)" opacity="0.8" className="animate-[pulse_3s_ease-in-out_infinite]" />
    <circle cx="50%" cy="45%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="70%" cy="25%" r="3" fill="var(--star-white)" opacity="0.9" className="animate-[pulse_4s_ease-in-out_infinite]" />
    <circle cx="85%" cy="50%" r="2" fill="currentColor" opacity="0.5" />
  </g>,

  // 3. Orion (Hourglass)
  <g key="orion" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="30%" y1="20%" x2="70%" y2="25%" />
    <line x1="30%" y1="20%" x2="40%" y2="50%" />
    <line x1="70%" y1="25%" x2="60%" y2="55%" />
    <line x1="40%" y1="50%" x2="60%" y2="55%" />
    <line x1="40%" y1="50%" x2="25%" y2="80%" />
    <line x1="60%" y1="55%" x2="75%" y2="85%" />
    <line x1="25%" y1="80%" x2="75%" y2="85%" />
    <circle cx="30%" cy="20%" r="3" fill="var(--star-white)" opacity="0.8" className="animate-[pulse_2s_ease-in-out_infinite]" />
    <circle cx="70%" cy="25%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="40%" cy="50%" r="2" fill="currentColor" opacity="0.9" />
    <circle cx="50%" cy="52%" r="2" fill="currentColor" opacity="0.9" />
    <circle cx="60%" cy="55%" r="2" fill="currentColor" opacity="0.9" />
    <circle cx="25%" cy="80%" r="2.5" fill="var(--star-white)" opacity="0.7" />
    <circle cx="75%" cy="85%" r="3" fill="currentColor" opacity="0.8" className="animate-[pulse_5s_ease-in-out_infinite]" />
  </g>,

  // 4. Cygnus (Cross)
  <g key="cygnus" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="50%" y1="15%" x2="50%" y2="50%" />
    <line x1="50%" y1="50%" x2="50%" y2="85%" />
    <line x1="20%" y1="50%" x2="50%" y2="50%" />
    <line x1="50%" y1="50%" x2="80%" y2="50%" />
    <circle cx="50%" cy="15%" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="50%" cy="50%" r="3" fill="var(--star-white)" opacity="0.9" className="animate-[pulse_3s_ease-in-out_infinite]" />
    <circle cx="50%" cy="85%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="20%" cy="50%" r="2.5" fill="currentColor" opacity="0.7" />
    <circle cx="80%" cy="50%" r="2.5" fill="currentColor" opacity="0.7" />
  </g>,

  // 5. Lyra (Parallelogram)
  <g key="lyra" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="40%" y1="30%" x2="60%" y2="35%" />
    <line x1="60%" y1="35%" x2="70%" y2="60%" />
    <line x1="70%" y1="60%" x2="50%" y2="55%" />
    <line x1="50%" y1="55%" x2="40%" y2="30%" />
    <line x1="40%" y1="30%" x2="30%" y2="10%" />
    <circle cx="30%" cy="10%" r="3.5" fill="var(--star-white)" opacity="0.9" className="animate-[pulse_2s_ease-in-out_infinite]" />
    <circle cx="40%" cy="30%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="60%" cy="35%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="70%" cy="60%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="50%" cy="55%" r="2.5" fill="currentColor" opacity="0.8" />
  </g>,

  // 6. Scorpius (Curved tail)
  <g key="scorpius" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="80%" y1="20%" x2="60%" y2="30%" />
    <line x1="60%" y1="30%" x2="50%" y2="50%" />
    <line x1="50%" y1="50%" x2="40%" y2="70%" />
    <line x1="40%" y1="70%" x2="25%" y2="80%" />
    <line x1="25%" y1="80%" x2="15%" y2="70%" />
    <line x1="15%" y1="70%" x2="20%" y2="55%" />
    <circle cx="80%" cy="20%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="60%" cy="30%" r="3" fill="var(--star-white)" opacity="0.9" className="animate-[pulse_4s_ease-in-out_infinite]" />
    <circle cx="50%" cy="50%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="40%" cy="70%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="25%" cy="80%" r="2.5" fill="currentColor" opacity="0.8" />
    <circle cx="15%" cy="70%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="20%" cy="55%" r="2" fill="var(--star-white)" opacity="0.8" className="animate-[pulse_3s_ease-in-out_infinite]" />
  </g>,

  // 7. Pegasus (Square with legs)
  <g key="pegasus" stroke="currentColor" strokeWidth="0.5" opacity="0.4">
    <line x1="30%" y1="30%" x2="70%" y2="35%" />
    <line x1="70%" y1="35%" x2="65%" y2="70%" />
    <line x1="65%" y1="70%" x2="25%" y2="65%" />
    <line x1="25%" y1="65%" x2="30%" y2="30%" />
    <line x1="25%" y1="65%" x2="15%" y2="85%" />
    <line x1="70%" y1="35%" x2="85%" y2="20%" />
    <circle cx="30%" cy="30%" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="70%" cy="35%" r="2.5" fill="var(--star-white)" opacity="0.8" className="animate-[pulse_4s_ease-in-out_infinite]" />
    <circle cx="65%" cy="70%" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="25%" cy="65%" r="3" fill="currentColor" opacity="0.9" className="animate-[pulse_3s_ease-in-out_infinite]" />
    <circle cx="15%" cy="85%" r="2" fill="var(--star-white)" opacity="0.5" />
    <circle cx="85%" cy="20%" r="2" fill="currentColor" opacity="0.6" />
  </g>
];

export default function SectionStarryMotif({ variant, position = 'full', particleCount }: { variant?: number, position?: 'full' | 'top-left' | 'top-right' | 'random-corner', particleCount?: number }) {
  const [mounted, setMounted] = useState(false);
  const [constellationIndex, setConstellationIndex] = useState(0);
  const [actualPosition, setActualPosition] = useState<'full' | 'top-left' | 'top-right'>('full');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    if (variant !== undefined && variant >= 1 && variant <= 7) {
      setConstellationIndex(variant - 1);
    } else {
      setConstellationIndex(Math.floor(Math.random() * 7));
    }

    if (position === 'random-corner') {
      setActualPosition(Math.random() > 0.5 ? 'top-left' : 'top-right');
    } else {
      setActualPosition(position);
    }

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          mouseX.set(x);
          mouseY.set(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, variant, position]);

  // Sinh random particles giống banner (BackgroundVisuals)
  const particles = useMemo(() => {
    if (!mounted) return [];
    // Giảm mạnh số lượng hạt (từ 150/50 xuống 30/12) để triệt tiêu hoàn toàn lag mà vẫn giữ được hiệu ứng
    const count = particleCount || (position === 'random-corner' ? 30 : 12);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 150}px`,
      ty: `${(Math.random() - 0.5) * 150 - 50}px`,
      size: Math.random() * 3 + 1,
      duration: `${Math.random() * 20 + 20}s`,
      delay: `-${Math.random() * 20}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      parallaxZ: Math.random() * 60 + 10,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, [mounted, particleCount, position]);

  if (!mounted) return null;

  return (
    <motion.div
      style={{ '--mx': smoothX, '--my': smoothY } as any}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-100 dark:opacity-90 transition-opacity duration-1000 text-[#C7A25C] dark:text-[#D3AE3E] [--star-white:#ce9e51] dark:[--star-white:#ffffff]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-currentColor/10 dark:from-currentColor/15 via-transparent to-transparent opacity-100 dark:opacity-80"></div>

      {/* LAYER 1: Luxury Particles with High-Performance CSS Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              transform: `translate(calc(var(--mx) * ${p.parallaxZ}px), calc(var(--my) * ${p.parallaxZ}px))`
            }}
          >
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
        ))}
      </div>

      {/* LAYER 2: Enhanced Constellation Motif */}
      <div
        style={{
          transform: `translate(calc(var(--mx) * -20px), calc(var(--my) * -20px))`
        }}
        className={`absolute mix-blend-multiply dark:mix-blend-normal ${actualPosition === 'top-left' ? 'top-[-5%] left-[-5%] w-[400px] h-[400px] opacity-90' :
            actualPosition === 'top-right' ? 'top-[-5%] right-[-5%] w-[400px] h-[400px] opacity-90' :
              'inset-[-5%] w-[110%] h-[110%]'
          }`}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(211,174,62,0.4)]">
          {CONSTELLATIONS[constellationIndex]}
        </svg>
      </div>

      {/* LAYER 3: Architectural Compass Node (Adds Luxury Tech Vibe) */}
      {actualPosition === 'full' && (
        <div
          className="absolute top-[10%] right-[10%] w-[180px] h-[180px] opacity-30"
          style={{
            transform: `translate(calc(var(--mx) * 30px), calc(var(--my) * 30px))`,
            animation: 'spin-slow 60s linear infinite'
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 4" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

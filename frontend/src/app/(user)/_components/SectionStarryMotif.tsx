'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

export default function SectionStarryMotif({ variant, position = 'full' }: { variant?: number, position?: 'full' | 'top-left' | 'top-right' | 'random-corner' }) {
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
    // Pick constellation randomly if not provided
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

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, variant]);

  const layer1X = useTransform(smoothX, [-1, 1], [-5, 5]);
  const layer1Y = useTransform(smoothY, [-1, 1], [-5, 5]);
  
  const layer2X = useTransform(smoothX, [-1, 1], [-15, 15]);
  const layer2Y = useTransform(smoothY, [-1, 1], [-15, 15]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80 dark:opacity-40 transition-opacity duration-1000 mix-blend-multiply dark:mix-blend-screen text-[#C7A25C] dark:text-[#D3AE3E] [--star-white:#A67C00] dark:[--star-white:#ffffff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-currentColor/5 dark:from-currentColor/10 via-transparent to-transparent opacity-100 dark:opacity-60"></div>

      {/* LAYER 1: Very subtle scattered stars */}
      <motion.div 
        style={{ x: layer1X, y: layer1Y }}
        className="absolute inset-[-5%] w-[110%] h-[110%]"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="section-star-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="currentColor" opacity="0.5" />
              <circle cx="160" cy="120" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="90" cy="180" r="1" fill="var(--star-white)" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#section-star-pattern)" />
        </svg>
      </motion.div>

      {/* LAYER 2: Constellation Motif (1 of 7 variants) */}
      <motion.div 
        style={{ x: layer2X, y: layer2Y }}
        className={`absolute ${
          actualPosition === 'top-left' ? 'top-[-5%] left-[-5%] w-[400px] h-[400px] opacity-80' : 
          actualPosition === 'top-right' ? 'top-[-5%] right-[-5%] w-[400px] h-[400px] opacity-80' : 
          'inset-[-5%] w-[110%] h-[110%]'
        }`}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {CONSTELLATIONS[constellationIndex]}
        </svg>
      </motion.div>
    </div>
  );
}

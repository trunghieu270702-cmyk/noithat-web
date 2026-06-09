'use client';
import React, { useEffect, useRef, useState } from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
};

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getBaseStyle = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate-y-12 opacity-0';
      case 'fade-in':
        return 'opacity-0';
      case 'fade-left':
        return 'translate-x-12 opacity-0';
      case 'fade-right':
        return '-translate-x-12 opacity-0';
      default:
        return 'opacity-0';
    }
  };

  const getActiveStyle = () => {
    switch (animation) {
      case 'fade-up':
      case 'fade-left':
      case 'fade-right':
        return 'translate-y-0 translate-x-0 opacity-100';
      case 'fade-in':
      default:
        return 'opacity-100';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${isVisible ? getActiveStyle() : getBaseStyle()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

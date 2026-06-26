'use client';
import React from 'react';
import { useInView } from 'react-intersection-observer';

type ScrollRevealProps = {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in';
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  className?: string;
  threshold?: number;
  once?: boolean;
};

const getTransformHidden = (animation: string) => {
  switch (animation) {
    case 'fade-up':    return 'translateY(40px)';
    case 'fade-left':  return 'translateX(40px)';
    case 'fade-right': return 'translateX(-40px)';
    case 'zoom-in':    return 'scale(0.92)';
    default:           return 'none';
  }
};

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: once,
    initialInView: false,
  });

  const transformHidden = getTransformHidden(animation);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : transformHidden,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

'use client';
import React from 'react';

type AccentVariant = 'overlapping-squares' | 'overlapping-rectangles' | 'overlapping-circles';

interface Props {
  variant: AccentVariant;
  className?: string;
}

export default function ArchitecturalAccent({ variant, className = '' }: Props) {
  return null;
}

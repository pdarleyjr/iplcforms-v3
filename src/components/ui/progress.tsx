import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'gold' | 'green' | 'navy';
}

export function Progress({
  value,
  max = 100,
  className = '',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variantStyles = {
    default: 'gradient-metallic-primary',
    gold: 'gradient-metallic-gold',
    green: 'gradient-metallic-green',
    navy: 'gradient-metallic-navy',
  };
  
  return (
    <div
      className={cn(
        "w-full bg-iplc-neutral-200 rounded-full h-2 overflow-hidden shadow-[var(--iplc-shadow-sm)]",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          variantStyles[variant],
          "shadow-[0_0_10px_rgba(39,89,159,0.3)]"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
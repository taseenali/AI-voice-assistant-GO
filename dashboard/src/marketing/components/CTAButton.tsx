import type { ReactNode } from 'react';

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'petrol' | 'aqua' | 'ghost';
  size?: 'sm' | 'lg';
  className?: string;
}

const base = 'inline-block no-underline font-semibold transition-colors';

const variants: Record<string, string> = {
  petrol: 'bg-primary text-white hover:bg-primary-dark',
  aqua: 'bg-accent text-on-accent hover:bg-accent-hover',
  ghost: 'bg-transparent text-white border border-white/[0.24] hover:border-accent',
};

const sizes: Record<string, string> = {
  sm: 'text-[15px] px-5 py-[11px] rounded-[8px]',
  lg: 'text-[16px] px-[26px] py-[15px] rounded-[9px]',
};

export function CTAButton({
  href,
  children,
  variant = 'petrol',
  size = 'sm',
  className = '',
}: CTAButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </a>
  );
}

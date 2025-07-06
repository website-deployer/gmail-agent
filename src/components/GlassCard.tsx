import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const baseClasses = `
    backdrop-blur-xl bg-white/10 
    border border-white/20 
    rounded-2xl shadow-2xl
    transition-all duration-300
  `;

  const hoverClasses = hover ? `
    hover:bg-white/20 
    hover:border-white/30 
    hover:shadow-3xl 
    hover:scale-[1.02]
    cursor-pointer
  ` : '';

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
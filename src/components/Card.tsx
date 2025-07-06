import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default'
}) => {
  const baseClasses = `
    bg-white border border-gray-200 rounded-lg
    transition-all duration-200 ease-out
  `;

  const variantClasses = {
    default: 'shadow-sm hover:shadow-md',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-gray-300 hover:border-gray-400'
  };

  const hoverClasses = hover ? `
    cursor-pointer hover:shadow-md hover:border-gray-300
  ` : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
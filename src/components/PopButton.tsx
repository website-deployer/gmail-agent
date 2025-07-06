import React from 'react';

interface PopButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const PopButton: React.FC<PopButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-150 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    border
  `;

  const variantClasses = {
    primary: 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900 focus:ring-gray-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600 focus:ring-yellow-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
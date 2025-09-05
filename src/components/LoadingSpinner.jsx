'use client';

export default function LoadingSpinner({ size = 'md', className = '', color = 'blue' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-gray-200 border-t-blue-600',
    white: 'border-gray-300 border-t-white',
    gray: 'border-gray-300 border-t-gray-600',
    green: 'border-gray-200 border-t-green-600'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 rounded-full animate-spin duration-1000`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

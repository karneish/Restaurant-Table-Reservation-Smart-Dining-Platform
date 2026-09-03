import React from 'react';
interface Props { size?: 'sm'|'md'|'lg'; text?: string; fullScreen?: boolean; }
const LoadingSpinner: React.FC<Props> = ({ size = 'md', text, fullScreen }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-emerald-600 border-t-transparent rounded-full animate-spin`} role="status" aria-label="Loading" />
      {text && <p className="text-sm text-gray-500 animate-pulse font-medium">{text}</p>}
    </div>
  );
  return fullScreen ? <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">{spinner}</div> : <div className="flex items-center justify-center py-12">{spinner}</div>;
};
export default LoadingSpinner;

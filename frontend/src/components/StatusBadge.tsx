import React from 'react';
import { getStatusColor, formatReservationStatus } from '../utils/formats';
interface Props { status: string; size?: 'sm'|'md'|'lg'; className?: string; }
const StatusBadge: React.FC<Props> = ({ status, size = 'md', className = '' }) => {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' };
  const dotColor = status === 'CONFIRMED' || status === 'SEATED' ? 'bg-emerald-500' : status === 'HOLD' ? 'bg-amber-500' : status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-500';
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getStatusColor(status)} ${sizes[size]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {formatReservationStatus(status)}
    </span>
  );
};
export default StatusBadge;

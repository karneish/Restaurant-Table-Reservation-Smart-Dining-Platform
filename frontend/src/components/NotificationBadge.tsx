import React from 'react';
import { Bell } from 'lucide-react';
interface Props { count: number; onClick?: () => void; }
const NotificationBadge: React.FC<Props> = ({ count, onClick }) => (
  <button onClick={onClick} className="relative p-2 rounded-full hover:bg-white/20 transition-colors" aria-label={`Notifications: ${count} unread`}>
    <Bell className="w-5 h-5 text-emerald-100" />
    {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{count > 99 ? '99+' : count}</span>}
  </button>
);
export default NotificationBadge;

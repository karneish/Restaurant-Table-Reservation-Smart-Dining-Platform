import React from 'react';
import { Check, Clock, CreditCard, Utensils, Star } from 'lucide-react';
interface Props { status: string; billPaid?: boolean; hasFeedback?: boolean; }
const VisitTimeline: React.FC<Props> = ({ status, billPaid = false, hasFeedback = false }) => {
  const steps = [
    { label: 'Reserved', done: true, icon: <Clock className="w-4 h-4" /> },
    { label: 'Confirmed', done: ['CONFIRMED','SEATED','COMPLETED'].includes(status), icon: <Check className="w-4 h-4" /> },
    { label: 'Dining', done: ['SEATED','COMPLETED'].includes(status), icon: <Utensils className="w-4 h-4" /> },
    { label: 'Paid', done: billPaid || status === 'COMPLETED', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Feedback', done: hasFeedback || status === 'COMPLETED', icon: <Star className="w-4 h-4" /> },
  ];
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.done ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s.icon}</div>
            <span className={`text-xs font-medium ${s.done ? 'text-emerald-700' : 'text-gray-400'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${steps[i+1].done ? 'bg-emerald-600' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};
export default VisitTimeline;

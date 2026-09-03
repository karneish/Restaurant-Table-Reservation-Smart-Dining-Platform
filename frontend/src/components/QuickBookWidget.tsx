import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search } from 'lucide-react';
const QuickBookWidget: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const handleSearch = () => { const p = new URLSearchParams(); if (date) p.set('date', date); p.set('partySize', String(partySize)); navigate(`/restaurants?${p}`); };
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Book a Table</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5"><Calendar className="w-4 h-4 inline mr-1" />Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5"><Users className="w-4 h-4 inline mr-1" />Guests</label>
          <select value={partySize} onChange={e => setPartySize(Number(e.target.value))} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={handleSearch} className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"><Search className="w-4 h-4" />Find Tables</button>
        </div>
      </div>
    </div>
  );
};
export default QuickBookWidget;

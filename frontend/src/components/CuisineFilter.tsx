import React from 'react';
interface Props { cuisines: string[]; selected: string; onSelect: (c: string) => void; }
const ICONS: Record<string, string> = { 'Indian': 'ðŸ›', 'Italian': 'ðŸ•', 'Chinese': 'ðŸ¥¡', 'Japanese': 'ðŸ£', 'Thai': 'ðŸœ', 'Mexican': 'ðŸŒ®', 'American': 'ðŸ”' };
const CuisineFilter: React.FC<Props> = ({ cuisines, selected, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    <button onClick={() => onSelect('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === '' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/80 text-gray-600 border border-gray-200'}`}>All</button>
    {cuisines.map(c => (
      <button key={c} onClick={() => onSelect(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selected === c ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/80 text-gray-600 border border-gray-200'}`}>
        <span>{ICONS[c] || 'ðŸ½ï¸'}</span>{c}
      </button>
    ))}
  </div>
);
export default CuisineFilter;

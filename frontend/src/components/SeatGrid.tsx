import type { Seat } from '../types';

interface Props {
  seats: Seat[];
  selectedSeats: number[];
  onToggle: (seatId: number) => void;
}

export default function SeatGrid({ seats, selectedSeats, onToggle }: Props) {
  const categories = ['PREMIUM', 'GOLD', 'SILVER', 'REGULAR'];
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'PREMIUM': return 'bg-purple-500 hover:bg-purple-600 border-purple-400';
      case 'GOLD': return 'bg-amber-500 hover:bg-amber-600 border-amber-400';
      case 'SILVER': return 'bg-slate-400 hover:bg-slate-500 border-slate-300';
      default: return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-400';
    }
  };

  return (
    <div>
      <div className="bg-gray-200 rounded-lg p-4 mb-6 text-center text-sm text-gray-500 font-medium">
        SCREEN
      </div>

      <div className="flex justify-center gap-6 mb-6 text-xs text-gray-500">
        {categories.map(cat => (
          <div key={cat} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${cat === 'PREMIUM' ? 'bg-purple-500' : cat === 'GOLD' ? 'bg-amber-500' : cat === 'SILVER' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
            {cat}
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-200" /> Booked
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(grouped).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center justify-center gap-1">
            <span className="w-6 text-xs text-gray-400 font-medium">{row}</span>
            {rowSeats.map(seat => {
              const isSelected = selectedSeats.includes(seat.id);
              const isBooked = seat.status !== 'AVAILABLE';
              return (
                <button
                  key={seat.id}
                  onClick={() => !isBooked && onToggle(seat.id)}
                  disabled={isBooked}
                  className={`w-8 h-8 rounded-t-lg border text-[10px] font-medium transition-all ${
                    isBooked
                      ? 'bg-gray-200 text-gray-300 cursor-not-allowed border-gray-200'
                      : isSelected
                        ? 'bg-red-500 text-white border-red-400 scale-110'
                        : `${getCategoryColor(seat.category)} text-white border-opacity-50}`
                  }`}
                  title={`${seat.seatRow}${seat.seatNumber} - ${seat.category}`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
            <span className="w-6 text-xs text-gray-400 font-medium">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

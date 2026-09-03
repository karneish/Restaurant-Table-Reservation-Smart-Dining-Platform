import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { formatDate, formatTime } from '../utils/helpers';
import type { Reservation } from '../types';
interface Props { reservation: Reservation; }
const ReservationSummaryCard: React.FC<Props> = ({ reservation }) => (
  <Link to={`/reservations/${reservation.reservationId}`} className="block bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 p-4 hover:shadow-lg transition-all">
    <div className="flex justify-between mb-3">
      <div><h3 className="font-semibold text-gray-900">{reservation.restaurantName}</h3><p className="text-sm text-gray-500">#{reservation.confirmationCode}</p></div>
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${reservation.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : reservation.status === 'HOLD' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{reservation.status}</span>
    </div>
    <div className="flex gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-emerald-600" />{formatDate(reservation.reservationDateTime)} {formatTime(reservation.reservationDateTime)}</div>
      <div className="flex items-center gap-1"><Users className="w-4 h-4 text-emerald-600" />{reservation.partySize} guests</div>
    </div>
  </Link>
);
export default ReservationSummaryCard;

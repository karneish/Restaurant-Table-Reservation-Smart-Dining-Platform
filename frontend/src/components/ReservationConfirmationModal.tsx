import React from 'react';
import { CheckCircle, Calendar, Users } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import type { Reservation } from '../types';
interface Props { reservation: Reservation; onClose: () => void; onViewDetails: () => void; }
const ReservationConfirmationModal: React.FC<Props> = ({ reservation, onClose, onViewDetails }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h2>
      <div className="bg-emerald-50 rounded-xl p-4 mb-6">
        <p className="text-2xl font-mono font-bold text-emerald-700">{reservation.confirmationCode}</p>
      </div>
      <div className="space-y-2 text-left text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-600" />{formatDate(reservation.reservationDateTime)} at {formatTime(reservation.reservationDateTime)}</div>
        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" />{reservation.partySize} guests</div>
        <div className="flex items-center gap-2">Deposit: {formatCurrency(reservation.depositAmount)}</div>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium">Close</button>
        <button onClick={onViewDetails} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium">View Details</button>
      </div>
    </div>
  </div>
);
export default ReservationConfirmationModal;

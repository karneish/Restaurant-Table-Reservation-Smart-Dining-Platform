export function formatReservationStatus(s: string): string {
  return ({ HOLD: 'Pending', CONFIRMED: 'Confirmed', SEATED: 'Dining', COMPLETED: 'Completed', CANCELLED: 'Cancelled', NO_SHOW: 'No Show' } as Record<string,string>)[s] || s;
}
export function getStatusColor(s: string): string {
  return ({ HOLD: 'text-amber-600 bg-amber-50', CONFIRMED: 'text-emerald-600 bg-emerald-50', SEATED: 'text-blue-600 bg-blue-50', COMPLETED: 'text-gray-600 bg-gray-50', CANCELLED: 'text-red-600 bg-red-50' } as Record<string,string>)[s] || 'text-gray-600 bg-gray-50';
}
export function formatCleaningStatus(s: string): string {
  return ({ READY: 'Ready', DIRTY: 'Needs Cleaning', CLEANING: 'Being Cleaned' } as Record<string,string>)[s] || s;
}
export function formatPaymentMethod(m: string): string {
  return ({ CARD: 'Credit/Debit Card', UPI: 'UPI Payment', CASH: 'Cash on Visit' } as Record<string,string>)[m] || m;
}
export function formatOccasion(o?: string): string {
  if (!o) return 'Regular Dining';
  return ({ birthday: 'Birthday', anniversary: 'Anniversary', business: 'Business Meeting', date: 'Date Night', family: 'Family Gathering' } as Record<string,string>)[o.toLowerCase()] || o;
}
export function getRatingLabel(r: number): string {
  if (r >= 4.5) return 'Excellent'; if (r >= 4.0) return 'Very Good';
  if (r >= 3.5) return 'Good'; if (r >= 3.0) return 'Average'; return 'Below Average';
}

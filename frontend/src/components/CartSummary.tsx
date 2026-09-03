import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
interface CartItem { menuItemId: number; name: string; unitPrice: number; quantity: number; }
interface Props { items: CartItem[]; onUpdate: (id: number, qty: number) => void; onRemove: (id: number) => void; }
const CartSummary: React.FC<Props> = ({ items, onUpdate, onRemove }) => {
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  if (!items.length) return <p className="text-center py-8 text-gray-400 text-sm">No items yet</p>;
  return (
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.menuItemId} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-100">
          <span className="text-sm font-medium text-gray-900 truncate flex-1">{i.name}</span>
          <div className="flex items-center gap-2 ml-4">
            <button onClick={() => onUpdate(i.menuItemId, Math.max(0, i.quantity - 1))} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
            <span className="text-sm font-medium w-6 text-center">{i.quantity}</span>
            <button onClick={() => onUpdate(i.menuItemId, i.quantity + 1)} className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm font-semibold text-emerald-700">{formatCurrency(i.unitPrice * i.quantity)}</span>
            <button onClick={() => onRemove(i.menuItemId)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      <div className="border-t pt-3 flex justify-between"><span className="text-sm font-medium text-gray-600">Total</span><span className="text-lg font-bold text-emerald-700">{formatCurrency(total)}</span></div>
    </div>
  );
};
export default CartSummary;

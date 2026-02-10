import { CheckCircle2, AlertCircle, BrainCircuit } from 'lucide-react';
import { MatchStatus } from '@/types';

interface Props {
  status: MatchStatus;
  type?: string;
}

export const StatusBadge = ({ status, type }: Props) => {
  if (status === 'matched') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
      <CheckCircle2 size={12} /> {type || 'Conciliado'}
    </span>
  );
  if (status === 'partial') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      <BrainCircuit size={12} /> {type || 'Revisión IA'}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
      <AlertCircle size={12} /> Discrepancia
    </span>
  );
};
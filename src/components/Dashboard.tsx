import React, { useState } from 'react';
import { BankTransaction } from '@/types';
import { StatusBadge } from './ui/StatusBadge';
import { Workbench } from './Workbench';
import { cn } from '@/lib/utils';

interface Props {
  transactions: BankTransaction[];
  onReset: () => void;
}

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  color?: string;
}

const KpiCard = ({ title, value, sub, color }: KpiCardProps) => (
  <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <h3 className={cn("text-3xl font-bold tracking-tight", color)}>{value}</h3>
    {sub && <p className="text-xs text-slate-400 mt-2 font-medium">{sub}</p>}
  </div>
);

export const Dashboard = ({ transactions, onReset }: Props) => {
  const [selectedTx, setSelectedTx] = useState<BankTransaction | null>(null);

  const stats = {
    total: transactions.length,
    matched: transactions.filter(t => t.status === 'matched').length,
    partial: transactions.filter(t => t.status === 'partial').length,
    unmatched: transactions.filter(t => t.status === 'unmatched').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#004B93] to-[#C9002B] rounded-full"></div>
            <span className="font-bold text-xl tracking-tight text-[#004B93]">PEPSI<span className="text-slate-800 font-light">CO</span></span>
        </div>
        <button onClick={onReset} className="text-sm font-medium text-slate-500 hover:text-[#004B93]">Nueva Carga</button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
           <h2 className="text-2xl font-bold text-slate-800 mb-6">Resumen de Conciliación</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCard title="Total" value={stats.total} color="text-slate-800" />
              <KpiCard title="Match Auto" value={stats.matched} sub={`${stats.total ? ((stats.matched/stats.total)*100).toFixed(0) : 0}% Efectividad`} color="text-emerald-600" />
              <KpiCard title="Sugerencias IA" value={stats.partial} sub="Requiere Aprobación" color="text-amber-600" />
              <KpiCard title="Discrepancias" value={stats.unmatched} sub="Acción Manual" color="text-rose-600" />
           </div>
        </div>

        <div className="flex gap-6 h-[600px]">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto p-2 space-y-2">
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center justify-between",
                  selectedTx?.id === tx.id ? "bg-blue-50/50 border-[#004B93] shadow-sm" : "bg-white border-slate-100 hover:border-blue-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-2 h-12 rounded-full", tx.status === 'matched' ? 'bg-emerald-500' : tx.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500')}></div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{tx.concept}</div>
                    <div className="text-xs text-slate-400 flex gap-2 mt-1"><span>{tx.date}</span><span>•</span><span className="font-mono">{tx.id}</span></div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="font-bold text-slate-900">{tx.amount.toLocaleString()} {tx.currency}</div>
                   <div className="mt-1 flex justify-end"><StatusBadge status={tx.status} type={tx.matchDetails?.type} /></div>
                </div>
              </div>
            ))}
          </div>
          <Workbench selectedTx={selectedTx} onClose={() => setSelectedTx(null)} />
        </div>
      </main>
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, Search, 
  LayoutDashboard, BrainCircuit, Layers, ShieldCheck,
  ChevronRight, X, ArrowUpRight, Filter, FileText, Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES & MOCK DATA ---
type StatusType = 'green' | 'yellow' | 'red';

interface Transaction {
  id: string;
  date: string;
  concept: string;
  amount: number;
  currency: string;
  type: StatusType;
  confidence: number;
  details: {
    reason: string;
    suggestion: string;
    sap_invoice: string;
    sap_client: string;
    sap_amount: number;
  };
}

const MOCK_DATA: Transaction[] = [
  {
    id: 'TRF00451',
    date: '2026-01-05',
    concept: 'TRANSF CLIENTE DISTRIBUCIONES NORTE SA',
    amount: 1250.00,
    currency: 'EUR',
    type: 'green',
    confidence: 100,
    details: {
      reason: 'R10: Coincidencia Exacta (Monto + Ref)',
      suggestion: 'Conciliar Automáticamente',
      sap_invoice: 'FAC-2403',
      sap_client: 'Distribuciones Norte SA',
      sap_amount: 1250.00
    }
  },
  {
    id: 'TRF00502',
    date: '2026-01-10',
    concept: 'ABONO CTA ALIMENTARIA GONZALEZ SL',
    amount: 890.00,
    currency: 'EUR',
    type: 'yellow',
    confidence: 92,
    details: {
      reason: 'Diferencia menor (10 EUR). Patrón histórico de comisión bancaria detectado por IA.',
      suggestion: 'Conciliar + Nota Crédito Automática',
      sap_invoice: 'FAC-2404',
      sap_client: 'Alimentaria González SL',
      sap_amount: 900.00
    }
  },
  {
    id: 'TRF00531',
    date: '2026-01-15',
    concept: 'TRANSF COMERCIAL MARTINEZ',
    amount: 1200.00,
    currency: 'EUR',
    type: 'red',
    confidence: 45,
    details: {
      reason: 'Diferencia de 50 EUR sin patrón histórico. Riesgo de impago parcial.',
      suggestion: 'Validación Manual Requerida',
      sap_invoice: 'FAC-2405',
      sap_client: 'Comercial Martínez e Hijos',
      sap_amount: 1250.00
    }
  },
  {
    id: 'TRF00489',
    date: '2026-01-08',
    concept: 'PAGO FAC 2401 2402 SUPERMERCADOS DEL SUR',
    amount: 3780.50,
    currency: 'EUR',
    type: 'green',
    confidence: 100,
    details: {
      reason: 'R11: 1 Pago = N Facturas (Algoritmo de Suma)',
      suggestion: 'Conciliar Automáticamente',
      sap_invoice: 'FAC-2401 + FAC-2402',
      sap_client: 'Supermercados del Sur SL',
      sap_amount: 3780.50
    }
  },
  {
    id: 'TRF00578',
    date: '2026-01-22',
    concept: 'ABONO',
    amount: 4500.00,
    currency: 'EUR',
    type: 'red',
    confidence: 62,
    details: {
      reason: 'Concepto genérico "ABONO". Múltiples facturas coinciden con el monto.',
      suggestion: 'Solicitar Comprobante',
      sap_invoice: 'FAC-2407',
      sap_client: 'Mayorista Central SAU',
      sap_amount: 4500.00
    }
  },
];

// --- COMPONENTS ---

const StatusBadge = ({ type }: { type: StatusType }) => {
  const config = {
    green: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Reglas' },
    yellow: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: BrainCircuit, label: 'IA Sugiere' },
    red: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', icon: AlertTriangle, label: 'Discrepancia' },
  };
  const Style = config[type];
  const Icon = Style.icon;

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", Style.bg, Style.text, Style.border)}>
      <Icon size={14} className="mr-1.5" />
      {Style.label}
    </span>
  );
};

const MetricCard = ({ title, value, sub, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-lg text-white", colorClass)}>
        <Icon size={24} />
      </div>
      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Ene 2026</span>
    </div>
    <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    {sub && (
      <div className="mt-3 text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded">
        <ArrowUpRight size={14} className="mr-1" /> {sub}
      </div>
    )}
  </div>
);

// --- MAIN PAGE ---

export default function Dashboard() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusType | 'all'>('all');

  const filteredData = activeFilter === 'all' 
    ? MOCK_DATA 
    : MOCK_DATA.filter(t => t.type === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      
      {/* NAVBAR PEPSI STYLE */}
      <header className="bg-[#004B93] text-white shadow-lg z-20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Simulado */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9002B] via-white to-[#004B93] border-2 border-white"></div>
            <div className="font-bold text-xl tracking-tight">
              PEPSI<span className="font-light opacity-80">CO</span> <span className="text-xs font-mono opacity-60 ml-2 border border-white/30 px-1 rounded">FINANCE AI</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
             <div className="hidden md:flex gap-6 opacity-90">
                <span className="cursor-pointer hover:text-white hover:opacity-100 transition">Dashboard</span>
                <span className="cursor-pointer hover:text-white hover:opacity-100 transition">Conciliación</span>
                <span className="cursor-pointer hover:text-white hover:opacity-100 transition">Reportes</span>
             </div>
             <div className="h-8 w-[1px] bg-white/20 mx-2"></div>
             <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                    <div className="text-xs opacity-70">Operador</div>
                    <div className="font-bold">Luis AutoTech</div>
                </div>
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center font-bold border border-white/20">LA</div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 relative">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Conciliación Bancaria</h1>
            <p className="text-slate-500 mt-1">Gestión inteligente de discrepancias y reglas de negocio.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
                Exportar Excel
            </button>
            <button className="bg-[#004B93] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 flex items-center gap-2">
                <BrainCircuit size={16} /> Ejecutar Análisis IA
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Transacciones" value="1,240" sub="12% vs mes anterior" icon={LayoutDashboard} colorClass="bg-slate-700" />
          <MetricCard title="Auto-Conciliado" value="85%" sub="Eficiencia Alta" icon={ShieldCheck} colorClass="bg-emerald-600" />
          <MetricCard title="Revisión IA" value="12%" sub="Pendiente Aprobación" icon={BrainCircuit} colorClass="bg-amber-500" />
          <MetricCard title="Discrepancias" value="3%" sub="Requiere Acción" icon={AlertTriangle} colorClass="bg-[#C9002B]" />
        </div>

        {/* MAIN INTERFACE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* LIST VIEW */}
          <div className={cn("flex-1 transition-all duration-300", selectedTx ? "md:w-2/3" : "w-full")}>
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-lg">
                    {(['all', 'green', 'yellow', 'red'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                activeFilter === filter ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {filter === 'all' ? 'Todo' : filter === 'green' ? 'Reglas' : filter === 'yellow' ? 'IA' : 'Alertas'}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64" placeholder="Buscar transacción..." />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[600px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Concepto Banco</th>
                            <th className="px-6 py-3 text-right">Monto</th>
                            <th className="px-6 py-3">Confianza</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.map((tx) => (
                            <tr 
                                key={tx.id} 
                                onClick={() => setSelectedTx(tx)}
                                className={cn(
                                    "group cursor-pointer hover:bg-slate-50 transition-colors border-l-4",
                                    selectedTx?.id === tx.id ? "bg-blue-50/50 border-l-[#004B93]" : "border-l-transparent"
                                )}
                            >
                                <td className="px-6 py-4"><StatusBadge type={tx.type} /></td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{tx.concept}</div>
                                    <div className="text-xs text-slate-500">{tx.date} • {tx.id}</div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-700">
                                    {tx.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {tx.currency}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn("h-full rounded-full", 
                                                    tx.confidence >= 90 ? "bg-emerald-500" : 
                                                    tx.confidence >= 70 ? "bg-amber-500" : "bg-rose-500"
                                                )} 
                                                style={{ width: `${tx.confidence}%` }} 
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">{tx.confidence}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400">
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* WORKBENCH (SIDE PANEL) */}
          {selectedTx && (
            <div className="w-full md:w-[450px] border-l border-slate-200 bg-white flex flex-col animate-in slide-in-from-right duration-300 absolute md:relative right-0 h-full z-20 shadow-2xl md:shadow-none">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Workbench de Conciliación</div>
                        <h2 className="text-lg font-bold text-slate-800">Detalle de Transacción</h2>
                    </div>
                    <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Banco Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-1"><Layers size={12}/> EXTRACTO BANCARIO</span>
                            <span className="text-xs text-slate-400 font-mono">{selectedTx.id}</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {selectedTx.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                        </div>
                        <div className="text-sm text-slate-600">{selectedTx.concept}</div>
                    </div>

                    {/* Analysis Card */}
                    <div className={cn("p-4 rounded-xl border shadow-sm", 
                        selectedTx.type === 'green' ? "bg-emerald-50 border-emerald-100" :
                        selectedTx.type === 'yellow' ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"
                    )}>
                        <div className="flex justify-between items-center mb-3">
                            <span className={cn("text-xs font-bold flex items-center gap-1",
                                selectedTx.type === 'green' ? "text-emerald-700" :
                                selectedTx.type === 'yellow' ? "text-amber-700" : "text-rose-700"
                            )}>
                                {selectedTx.type === 'green' ? <ShieldCheck size={14}/> : <BrainCircuit size={14}/>}
                                {selectedTx.type === 'green' ? "REGLA DETERMINÍSTICA" : "ANÁLISIS INTELIGENCIA ARTIFICIAL"}
                            </span>
                            <span className="bg-white/80 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                                {selectedTx.confidence}% Match
                            </span>
                        </div>
                        <p className="text-sm font-medium mb-3 opacity-90">{selectedTx.details.reason}</p>
                        <div className="bg-white/60 rounded p-2 text-xs font-medium">
                            💡 Sugerencia: {selectedTx.details.suggestion}
                        </div>
                    </div>

                    {/* SAP Match Card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                        <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><FileText size={12}/> CONTRA-PARTIDA SAP</div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-800">{selectedTx.details.sap_client}</span>
                            <span className="text-sm font-bold text-slate-900">{selectedTx.details.sap_amount.toLocaleString()} €</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono bg-white inline-block px-1 border border-slate-200 rounded">
                            {selectedTx.details.sap_invoice}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                    {selectedTx.type === 'yellow' && (
                        <>
                            <button className="w-full py-2.5 bg-[#004B93] text-white rounded-lg font-medium text-sm hover:bg-blue-800 shadow-lg shadow-blue-900/10 flex justify-center items-center gap-2">
                                <CheckCircle size={16} /> Confirmar Conciliación
                            </button>
                            <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50">
                                Rechazar Propuesta
                            </button>
                        </>
                    )}
                     {selectedTx.type === 'red' && (
                        <button className="w-full py-2.5 bg-[#C9002B] text-white rounded-lg font-medium text-sm hover:bg-rose-800 shadow-lg shadow-rose-900/10 flex justify-center items-center gap-2">
                            <AlertTriangle size={16} /> Abrir Disputa / Gestión
                        </button>
                    )}
                     {selectedTx.type === 'green' && (
                        <div className="text-center text-xs text-slate-400 font-medium py-2 flex items-center justify-center gap-1">
                            <CheckCircle size={14} /> Procesado automáticamente por reglas
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
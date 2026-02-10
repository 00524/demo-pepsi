import React from 'react';
import { XCircle, CheckCircle2, AlertCircle, BrainCircuit, LayoutGrid } from 'lucide-react';
import { BankTransaction } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  selectedTx: BankTransaction | null;
  onClose: () => void;
}

export const Workbench = ({ selectedTx, onClose }: Props) => {
  if (!selectedTx) {
    return (
      <div className="w-[450px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col p-6 items-center justify-center text-center opacity-40">
         <LayoutGrid size={48} className="mb-4 text-slate-300"/>
         <h3 className="font-bold text-slate-600">Selecciona una transacción</h3>
         <p className="text-sm text-slate-400 max-w-[200px]">Haz click en la lista para ver el detalle de reglas e IA.</p>
      </div>
    );
  }

  return (
    <div className="w-[450px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
       <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-slate-800">Detalle de Análisis</h3>
          <button onClick={onClose}><XCircle className="text-slate-400 hover:text-slate-600"/></button>
       </div>

       {/* Logic Box */}
       <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resultado del Motor</div>
          <div className="flex items-center gap-3 mb-4">
             <div className={cn("p-2 rounded-lg text-white", 
                selectedTx.status === 'matched' ? 'bg-emerald-500' : 
                selectedTx.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'
             )}>
                {selectedTx.status === 'matched' ? <CheckCircle2 /> : 
                 selectedTx.status === 'partial' ? <BrainCircuit /> : <AlertCircle />}
             </div>
             <div>
                <div className="font-bold text-slate-800">{selectedTx.matchDetails?.type}</div>
                <div className="text-xs text-slate-500">{selectedTx.matchDetails?.rule || "Sin regla aplicable"}</div>
             </div>
          </div>
          
          {selectedTx.matchDetails?.confidence !== undefined && (
             <div className="mb-4">
               <div className="flex justify-between text-xs mb-1">
                 <span className="font-medium text-slate-600">Nivel de Confianza</span>
                 <span className="font-bold text-slate-800">{selectedTx.matchDetails.confidence}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                     className={cn("h-full rounded-full transition-all duration-1000", 
                       selectedTx.matchDetails.confidence > 90 ? 'bg-emerald-500' : 
                       selectedTx.matchDetails.confidence > 50 ? 'bg-amber-500' : 'bg-rose-500'
                     )} 
                     style={{width: `${selectedTx.matchDetails.confidence}%`}}
                  ></div>
               </div>
             </div>
          )}

          {selectedTx.matchDetails?.notes && (
             <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs border border-amber-100">
               {selectedTx.matchDetails.notes}
             </div>
          )}
       </div>

       {/* Comparison */}
       <div className="space-y-4">
            <div className="relative pl-6 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="text-xs font-bold text-slate-500 mb-1">BANCO</div>
                <div className="font-mono text-sm bg-white border border-slate-200 p-2 rounded">
                    {selectedTx.concept}<br/>
                    <span className="font-bold text-slate-900">{selectedTx.amount} {selectedTx.currency}</span>
                </div>
            </div>

            <div className="relative pl-6 border-l-2 border-dashed border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#004B93] border-2 border-white"></div>
                <div className="text-xs font-bold text-[#004B93] mb-1">SAP (MATCH)</div>
                
                {selectedTx.matchDetails?.relatedInvoices?.length ? (
                    selectedTx.matchDetails.relatedInvoices.map((inv, idx) => (
                    <div key={idx} className="font-mono text-sm bg-blue-50 border border-blue-100 p-2 rounded mb-2">
                        {inv.id} - {inv.client}<br/>
                        <span className="font-bold text-blue-900">{inv.amount} EUR</span>
                    </div>
                    ))
                ) : (
                    <div className="text-sm text-slate-400 italic">No se encontraron documentos SAP compatibles.</div>
                )}
            </div>
       </div>
       
       {/* Actions */}
       <div className="mt-auto pt-6 border-t border-slate-200">
          <button className="w-full py-3 bg-[#004B93] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all mb-3">
             {selectedTx.status === 'matched' ? 'Confirmar Conciliación' : 
              selectedTx.status === 'partial' ? 'Aprobar Sugerencia' : 'Gestionar Discrepancia'}
          </button>
       </div>
    </div>
  );
};
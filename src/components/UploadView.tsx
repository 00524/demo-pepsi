import React, { useState } from 'react';
import { CheckCircle2, DollarSign, FileSpreadsheet, ArrowRight, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { RawExcelData } from '@/types';

interface Props {
  onProcess: (bankData: RawExcelData, sapData: RawExcelData) => void;
  isProcessing: boolean;
}

export const UploadView = ({ onProcess, isProcessing }: Props) => {
  const [fileBank, setFileBank] = useState<File | null>(null);
  const [fileSap, setFileSap] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!fileBank || !fileSap) return;

    const readExcel = (file: File): Promise<RawExcelData> => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as RawExcelData;
        resolve(jsonData);
      };
      reader.readAsBinaryString(file);
    });

    const bankData = await readExcel(fileBank);
    const sapData = await readExcel(fileSap);
    onProcess(bankData, sapData);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-[#004B93] p-12 text-white flex flex-col justify-between md:w-2/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9002B] rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl opacity-10 -ml-10 -mb-10"></div>
             <div>
               <div className="w-12 h-12 bg-white rounded-full mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-[#004B93] border-t-[#C9002B] border-b-[#fff]"></div>
               </div>
               <h1 className="text-3xl font-bold mb-2">Conciliación<br/>Inteligente</h1>
               <p className="opacity-80 text-sm">Plataforma financiera automatizada con Agentes IA.</p>
             </div>
             <div className="text-xs opacity-60 font-mono mt-12">v2.4.0 (Saturn Core)</div>
          </div>

          <div className="p-12 md:w-3/5 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Iniciar Proceso</h2>
            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${fileBank ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-[#004B93]'}`}>
                <label className="flex items-center gap-4 cursor-pointer">
                  <div className={`p-3 rounded-full ${fileBank ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {fileBank ? <CheckCircle2 size={24}/> : <DollarSign size={24}/>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700">{fileBank ? fileBank.name : "Extracto Bancario (.xlsx)"}</p>
                    <input type="file" accept=".xlsx" className="hidden" onChange={(e) => setFileBank(e.target.files?.[0] || null)} />
                  </div>
                </label>
              </div>

              <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${fileSap ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-[#004B93]'}`}>
                <label className="flex items-center gap-4 cursor-pointer">
                  <div className={`p-3 rounded-full ${fileSap ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {fileSap ? <CheckCircle2 size={24}/> : <FileSpreadsheet size={24}/>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700">{fileSap ? fileSap.name : "Reporte SAP (.xlsx)"}</p>
                    <input type="file" accept=".xlsx" className="hidden" onChange={(e) => setFileSap(e.target.files?.[0] || null)} />
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleUpload}
              disabled={!fileBank || !fileSap || isProcessing}
              className="mt-8 w-full bg-[#004B93] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <><RefreshCw className="animate-spin" /> Procesando...</> : <>Comenzar Análisis <ArrowRight size={20}/></>}
            </button>
          </div>
        </div>
    </div>
  );
};
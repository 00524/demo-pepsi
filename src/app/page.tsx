'use client';

import { useState } from 'react';
import { UploadView } from '@/components/UploadView';
import { Dashboard } from '@/components/Dashboard';
import { runReconciliationEngine } from '@/lib/engine';
import { BankTransaction, RawExcelData } from '@/types';

export default function Home() {
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = (bankData: RawExcelData, sapData: RawExcelData) => {
    setIsProcessing(true);
    setTimeout(() => {
      const results = runReconciliationEngine(bankData, sapData);
      setTransactions(results);
      setIsProcessing(false);
      setView('dashboard');
    }, 2000);
  };

  if (view === 'upload') {
    return <UploadView onProcess={handleProcess} isProcessing={isProcessing} />;
  }

  return <Dashboard transactions={transactions} onReset={() => setView('upload')} />;
}
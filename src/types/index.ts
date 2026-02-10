export type RawExcelRow = (string | number | null | undefined)[];

export type RawExcelData = RawExcelRow[];


export type MatchStatus = 'matched' | 'partial' | 'unmatched';

export interface SapInvoice {
  id: string;
  date: string;
  client: string;
  amount: number;
  status: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  concept: string;
  amount: number;
  currency: string;
  status: MatchStatus;
  matchDetails?: {
    type: 'Automático' | 'IA Sugerido' | 'Manual';
    rule?: string;
    confidence: number;
    relatedInvoices?: SapInvoice[];
    notes?: string;
  };
}
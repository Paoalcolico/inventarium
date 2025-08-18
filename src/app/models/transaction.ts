export interface Transaction {
  id?: number;
  type: 'ENTRADA' | 'SAIDA';
  totalValue: number;
  date: string; // ISO string format
  usuarioId: number;
  description?: string;
}

export interface TransactionRequest {
  type: 'ENTRADA' | 'SAIDA';
  totalValue: number;
  usuarioId: number;
  description?: string;
}
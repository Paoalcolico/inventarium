export interface Transaction {
  id?: number;
  productId: number;
  productName: string;
  productBrand?: string;
  type: 'ENTRADA' | 'SAIDA'; // MAIÚSCULO para bater com o backend
  quantity: number;
  unitPrice: number;
  totalValue: number;
  date: string; // ISO string format
  description?: string;
}

export interface TransactionRequest {
  productId: number;
  productName?: string;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  unitPrice: number;
  description?: string;
}
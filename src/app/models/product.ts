export interface Product {
  id?: number;
  manufacturerCode: string;
  brand: number; // Mudado para number pois agora é marcaId
  stockLocation: string;
  warrantyMonths: number;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

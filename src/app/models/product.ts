export interface Product {
  id?: number;
  manufacturerCode: string;
  brand: string;
  stockLocation: string;
  warrantyMonths: number;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

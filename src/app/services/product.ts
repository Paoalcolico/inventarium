  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { Product } from '../models/product';

  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private apiUrl = 'http://localhost:4000/api/products';

    constructor(private http: HttpClient) {}

    getSortedProductsByName(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/ordenar-bst`)
      .pipe(catchError(this.handleError));
  }

    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl)
        .pipe(catchError(this.handleError));
    }

    getProductById(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.apiUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }

    addProduct(product: Product): Observable<Product> {
      // Remove id se existir para criação
      const { id, createdAt, updatedAt, ...productData } = product;
      return this.http.post<Product>(this.apiUrl, productData)
        .pipe(catchError(this.handleError));
    }

    updateProduct(id: number, product: Product): Observable<Product> {
      // Remove campos não editáveis
      const { createdAt, updatedAt, ...productData } = product;
      return this.http.put<Product>(`${this.apiUrl}/${id}`, productData)
        .pipe(catchError(this.handleError));
    }

    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }

    searchProducts(searchTerm: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.apiUrl}/search?term=${encodeURIComponent(searchTerm)}`)
        .pipe(catchError(this.handleError));
    }

    getLowStockProducts(threshold: number = 10): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.apiUrl}/low-stock?threshold=${threshold}`)
        .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Ocorreu um erro desconhecido!';
      
      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
        }
      }
      
      console.error('Erro no ProductService:', errorMessage);
      return throwError(() => new Error(errorMessage));
    }
  }
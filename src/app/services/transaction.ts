import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction, TransactionRequest } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:4000/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  addTransaction(transaction: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction)
      .pipe(catchError(this.handleError));
  }

  getTransactionsByProduct(productId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/product/${productId}`)
      .pipe(catchError(this.handleError));
  }

  getTransactionsByType(type: 'ENTRADA' | 'SAIDA'): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/type/${type}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      }
    }
    
    console.error('Erro no TransactionService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
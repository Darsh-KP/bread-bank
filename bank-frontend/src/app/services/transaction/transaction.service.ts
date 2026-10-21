import { inject, Service } from '@angular/core';
import {VerifyPinRequestDTO} from '../../dtos/transaction/VerifyPinRequestDTO';
import {Observable} from 'rxjs';
import {TransactionRequestDTO} from '../../dtos/transaction/TransactionRequestDTO';
import {TransactionResponseDTO} from '../../dtos/transaction/TransactionResponseDTO';
import { HttpClient } from '@angular/common/http';

@Service()
export class TransactionService {
  private http = inject(HttpClient);
  private BASE_URL = 'http://localhost:8080/transaction';

  verifyPin(
    verifyPinRequestDTO: VerifyPinRequestDTO
  ): Observable<unknown> {
    return this.http.post<unknown>(`${this.BASE_URL}/verify-pin`, verifyPinRequestDTO);
  }

  processDepositTransaction (
    transactionRequestDTO: TransactionRequestDTO
  ): Observable<TransactionResponseDTO> {
    return this.http.post<TransactionResponseDTO>(`${this.BASE_URL}/deposit`, transactionRequestDTO);
  }

  processWithdrawTransaction (
    transactionRequestDTO: TransactionRequestDTO
  ): Observable<TransactionResponseDTO> {
    return this.http.post<TransactionResponseDTO>(`${this.BASE_URL}/withdraw`, transactionRequestDTO);
  }
}

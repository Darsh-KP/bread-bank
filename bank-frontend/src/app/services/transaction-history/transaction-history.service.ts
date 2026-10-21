import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TransactionHistoryRequestDto } from '../../dtos/transaction-history/TransactionHistoryRequestDto';
import { TransactionHistoryResponseDto } from '../../dtos/transaction-history/TransactionHistoryResponseDto';
import { TransactionHistoryItemDto } from '../../dtos/transaction-history/TransactionHistoryItemDto';

@Injectable({ providedIn: 'root' })
export class TransactionHistoryService {
  private readonly http = inject(HttpClient);

  async getHistory(request: TransactionHistoryRequestDto): Promise<TransactionHistoryItemDto[]> {
    const response = await firstValueFrom(
      this.http.post<TransactionHistoryResponseDto>('http://localhost:8080/transaction-history', request),
    );
    return response.transactions;
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DashboardAccountsService } from './dashboard-accounts/dashboard-accounts';
import { TransferRequestDTO } from '../dtos/transfer/TransferRequestDTO';
import { TransferResponseDTO } from '../dtos/transfer/TransferResponseDTO';

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly http = inject(HttpClient);
  private readonly dashboardAccountsService = inject(DashboardAccountsService);
  private readonly transferUrl = 'http://localhost:8080/transfer';

  async getAccounts(): Promise<Account[]> {
    const accounts = await this.dashboardAccountsService.getAccounts();

    return accounts.map((account) => ({
      id: String(account.accountNumber),
      name: account.marketingName,
      balance: account.balanceInCents / 100,
    }));
  }

  async transfer(request: TransferRequest): Promise<Account[]> {
    if (!request.fromAccountId || !request.toAccountId) {
      throw new Error('Please select valid accounts.');
    }

    if (request.fromAccountId === request.toAccountId) {
      throw new Error('Source and destination accounts must be different.');
    }

    if (!Number.isFinite(request.amount) || request.amount <= 0) {
      throw new Error('Transfer amount must be greater than zero.');
    }

    const amountInCents = Math.round(request.amount * 100);

    if (
      amountInCents <= 0 ||
      !Number.isSafeInteger(amountInCents) ||
      Math.abs(request.amount * 100 - amountInCents) > 1e-7
    ) {
      throw new Error('Please enter a valid amount with at most two decimal places.');
    }

    const fromAccountNumber = Number(request.fromAccountId);
    const toAccountNumber = Number(request.toAccountId);

    if (
      !Number.isSafeInteger(fromAccountNumber) ||
      !Number.isSafeInteger(toAccountNumber) ||
      fromAccountNumber <= 0 ||
      toAccountNumber <= 0
    ) {
      throw new Error('Invalid account number.');
    }

    const transferRequest: TransferRequestDTO = {
      fromAccountNumber,
      toAccountNumber,
      amountInCents,
    };

    const response = await firstValueFrom(
      this.http.post<TransferResponseDTO>(this.transferUrl, transferRequest),
    );

    if (!response.isSuccessful) {
      throw new Error('Transfer could not be completed.');
    }

    return this.getAccounts();
  }
}

import { Injectable } from '@angular/core';

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

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'checking',
    name: 'Checking',
    balance: 2500,
  },
  {
    id: 'savings',
    name: 'Savings',
    balance: 5000,
  },
];

@Injectable({ providedIn: 'root' })
export class TransferService {
  private accounts: Account[] = MOCK_ACCOUNTS.map((account) => ({ ...account }));

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAccounts(): Promise<Account[]> {
    await this.delay(500);
    return this.accounts.map((account) => ({ ...account }));
  }

  async transfer(request: TransferRequest): Promise<Account[]> {
    await this.delay(500);

    const fromAccount = this.accounts.find(
      (account) => account.id === request.fromAccountId,
    );

    const toAccount = this.accounts.find(
      (account) => account.id === request.toAccountId,
    );

    if (!fromAccount || !toAccount) {
      throw new Error('Please select valid accounts.');
    }

    if (fromAccount.id === toAccount.id) {
      throw new Error('Source and destination accounts must be different.');
    }

    if (!Number.isFinite(request.amount) || request.amount <= 0) {
      throw new Error('Transfer amount must be greater than zero.');
    }

    if (request.amount > fromAccount.balance) {
      throw new Error('Insufficient funds.');
    }

    fromAccount.balance -= request.amount;
    toAccount.balance += request.amount;

    return this.accounts.map((account) => ({ ...account }));
  }
}
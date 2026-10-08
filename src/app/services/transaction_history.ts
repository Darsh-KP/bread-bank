import { Injectable } from '@angular/core';

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT'; // defines the possible types of transactions

export interface Transaction { // defines the structure of a transaction object
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number; 
  balanceAfter: number; 
  counterpartyAccountId?: string;
  description?: string;
  createdAt: string; 
}

export const isMoneyOut = (type: TransactionType): boolean =>
  type === 'WITHDRAW' || type === 'TRANSFER_OUT';

/* ---------- mock data ---------- */

// Static mock data, newest first. Balances follow from a starting balance of $1,000.00.
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't_1008', accountId: 'acc_1', type: 'DEPOSIT', amount: 22.99, balanceAfter: 3370.74, description: 'Pie Profits', createdAt: '2026-09-27T14:10:00.000Z' },
  { id: 't_1007', accountId: 'acc_1', type: 'WITHDRAW', amount: 60, balanceAfter: 3347.75, description: 'Rye Rent', createdAt: '2026-09-20T18:45:00.000Z' },
  { id: 't_1006', accountId: 'acc_1', type: 'TRANSFER_IN', amount: 75, balanceAfter: 3407.75, counterpartyAccountId: 'acc_3', description: 'From Baker Billy', createdAt: '2026-09-15T12:30:00.000Z' },
  { id: 't_1005', accountId: 'acc_1', type: 'WITHDRAW', amount: 12.75, balanceAfter: 3332.75, description: 'Flour Fee', createdAt: '2026-09-12T08:20:00.000Z' },
  { id: 't_1004', accountId: 'acc_1', type: 'DEPOSIT', amount: 50, balanceAfter: 3345.5, description: 'Sourdough Sales', createdAt: '2026-09-09T16:05:00.000Z' },
  { id: 't_1003', accountId: 'acc_1', type: 'TRANSFER_OUT', amount: 120, balanceAfter: 3295.5, counterpartyAccountId: 'acc_2', description: 'To Baker Billy', createdAt: '2026-09-05T11:00:00.000Z' },
  { id: 't_1002', accountId: 'acc_1', type: 'WITHDRAW', amount: 84.5, balanceAfter: 3415.5, description: 'Toast Tax', createdAt: '2026-09-03T17:25:00.000Z' },
  { id: 't_1001', accountId: 'acc_1', type: 'DEPOSIT', amount: 2500, balanceAfter: 3500, description: 'Dough Deposit', createdAt: '2026-09-01T09:00:00.000Z' },
];

/**
 * Mock service. Later, replace the body of getTransactions() with a real HTTP call
 * (GET /accounts/:id/transactions) without touching the component.
 */
@Injectable({ providedIn: 'root' }) // marks the service as injectable and available throughout the application
export class TransactionService {
  async getTransactions(): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // fake latency
    return MOCK_TRANSACTIONS;
  }
}
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { Transaction, TransactionService, TransactionType, isMoneyOut } from '../../../services/transaction';

@Component({
  selector: 'app-transaction-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css',
})
export class TransactionHistory {
  private readonly service = inject(TransactionService);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly typeLabel: Record<TransactionType, string> = {
    DEPOSIT: 'Deposit',
    WITHDRAW: 'Withdrawal',
    TRANSFER_IN: 'Transfer in',
    TRANSFER_OUT: 'Transfer out',
  };

  constructor() {
    this.service
      .getTransactions()
      .then((list) => this.transactions.set(list))
      .catch(() => this.error.set("We couldn't load your transactions. Please try again."))
      .finally(() => this.loading.set(false));
  }
  isOut(t: Transaction): boolean {
  return isMoneyOut(t.type);
}

/** Signed amount in dollars: negative for money out. */
signedAmount(t: Transaction): number {
  return this.isOut(t) ? -t.amount : t.amount;
}
}

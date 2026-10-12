import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Transaction, TransactionService, TransactionType, isMoneyOut } from '../../../services/transaction_history';

const TYPE_LABEL: Record<TransactionType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdrawal',
  TRANSFER_IN: 'Transfer in',
  TRANSFER_OUT: 'Transfer out',
};

/**
 * A small card with the most recent transactions and a "Show all transactions" button.
 * Drop <app-recent-transactions /> into any page (for example the accounts page).
 *
 * It needs: TransactionService (src/app/services/transaction.ts) and the /history route.
 */
@Component({
  selector: 'app-recent-transactions',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.css',
})
export class RecentTransactions {
  private readonly service = inject(TransactionService);

  /** How many transactions to show. */
  readonly limit = input(5);

  /** Where the "Show all transactions" button goes. */
  readonly viewAllLink = input('/history');

  private readonly all = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  /** The newest transactions first, cut down to `limit`. */
  readonly recent = computed(() =>
    [...this.all()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, this.limit()),
  );

  constructor() {
    this.service
      .getTransactions()
      .then((list) => this.all.set(list))
      .catch(() => this.error.set("We couldn't load your recent transactions."))
      .finally(() => this.loading.set(false));
  }

  label(t: Transaction): string {
    return TYPE_LABEL[t.type];
  }

  isOut(t: Transaction): boolean {
    return isMoneyOut(t.type);
  }

  /** Amount in dollars, negative for money out. */
  signedAmount(t: Transaction): number {
    return this.isOut(t) ? -t.amount : t.amount;
  }
}

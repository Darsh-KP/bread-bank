import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';

import { isMoneyOut } from '../../../services/transaction_history';
import { TransactionHistoryService } from '../../../services/transaction-history/transaction-history.service';
import { TransactionHistoryItemDto } from '../../../dtos/transaction-history/TransactionHistoryItemDto';
import { TransactionHistoryType } from '../../../dtos/transaction-history/TransactionHistoryType';
import { AccountStateService } from '../../view/account/account-state/account-state.service';

const TYPE_LABEL: Record<TransactionHistoryType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdrawal',
  TRANSFER_IN: 'Transfer in',
  TRANSFER_OUT: 'Transfer out',
};

@Component({
  selector: 'app-recent-transactions',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.css',
})
export class RecentTransactions {
  private readonly historyService = inject(TransactionHistoryService);
  private readonly accountState = inject(AccountStateService);

  /** How many transactions to show. */
  readonly limit = input(5);

  /** Where the "Show all transactions" button goes. */
  readonly viewAllLink = input('/history');

  private readonly all = signal<TransactionHistoryItemDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  private requestId = 0;
  
  readonly recent = computed(() =>
  [...this.all()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, this.limit()),
);

  

constructor() {
  effect(() => {
    // re-runs whenever the selected account or the limit changes.
    const accountNumber = Number(this.accountState.selectedAccountNumber());
    const limit = this.limit();
    untracked(() => this.load(accountNumber, limit));
  });
}

private load(accountNumber: number, limit: number, showLoading = true): void {
  const id = ++this.requestId;
  if (showLoading) this.loading.set(true);
  this.error.set('');

  if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
    this.all.set([]);
    this.error.set('Choose an account to see its recent transactions.');
    this.loading.set(false);
    return;
  }

  this.historyService
    .getHistory({ accountNumber, limit })
    .then((list) => {
      if (id === this.requestId) this.all.set(list);
    })
    .catch(() => {
      if (id === this.requestId) this.error.set("We couldn't load your recent transactions.");
    })
    .finally(() => {
      if (id === this.requestId) this.loading.set(false);
    });
}

/** Re-fetches the list (for example after a deposit) without showing the loading placeholder. */
reload(): void {
  this.load(Number(this.accountState.selectedAccountNumber()), this.limit(), false);
}

  label(t: TransactionHistoryItemDto): string {
    return TYPE_LABEL[t.type];
  }

  isOut(t: TransactionHistoryItemDto): boolean {
    return isMoneyOut(t.type);
  }

  /** Amount in dollars, negative for money out. */
  signedAmount(t: TransactionHistoryItemDto): number {
    return this.isOut(t) ? -t.amount : t.amount;
  }
}
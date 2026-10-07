import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Account,
  TransferService,
} from '../../../services/transfer.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transfer',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css',
})
export class Transfer {
  private readonly transferService = inject(TransferService);

  readonly accounts = signal<Account[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly successMessage = signal('');

  fromAccountId = '';
  toAccountId = '';
  amount: number | null = null;

  constructor() {
    this.transferService
      .getAccounts()
      .then((accounts) => this.accounts.set(accounts))
      .catch(() => this.error.set('Could not load your accounts. Please try again.'))
      .finally(() => this.loading.set(false));
  }

  async submitTransfer(): Promise<void> {
    this.error.set('');
    this.successMessage.set('');

    if (!this.fromAccountId || !this.toAccountId || this.amount === null) {
      this.error.set('Please complete all transfer fields.');
      return;
    }

    this.submitting.set(true);

    try {
      const accounts = await this.transferService.transfer({
        fromAccountId: this.fromAccountId,
        toAccountId: this.toAccountId,
        amount: this.amount,
      });

      this.accounts.set(accounts);
      this.successMessage.set('Transfer completed successfully.');

      this.fromAccountId = '';
      this.toAccountId = '';
      this.amount = null;
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Transfer failed. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
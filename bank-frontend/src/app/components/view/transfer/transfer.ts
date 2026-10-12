import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Account,
  TransferService,
} from '../../../services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { NotificationService } from '../../shared/notifications/notification.service';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';

@Component({
  selector: 'app-transfer',
  imports: [FormsModule, CurrencyPipe, NavigationBar],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css',
})
export class Transfer {
  private readonly transferService = inject(TransferService);
  private readonly notificationService = inject(NotificationService);

  readonly accounts = signal<Account[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  // readonly error = signal('');
  // readonly successMessage = signal('');

  fromAccountId = '';
  toAccountId = '';
  amount: number | null = null;

  constructor() {
    this.transferService
      .getAccounts()
      .then((accounts) => this.accounts.set(accounts))
      // .catch(() => this.error.set('Could not load your accounts. Please try again.'))
      .catch(() =>
        this.notificationService.error('Could not load your accounts. Please try again.')
      )
      .finally(() => this.loading.set(false));
  }

  async submitTransfer(): Promise<void> {
    if (this.submitting()) return;

    if (!this.fromAccountId || !this.toAccountId || this.amount === null) {
      this.notificationService.error('Please complete all transfer fields.');
      return;
    }

    if (this.amount !== null && this.amount <= 0) {
      this.notificationService.warning('Transfer amount must be greater than zero.');
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
      this.notificationService.success('Transfer completed successfully.');

      this.fromAccountId = '';
      this.toAccountId = '';
      this.amount = null;
    } catch (error) {
      this.notificationService.error(
        error instanceof Error ? error.message : 'Transfer failed. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
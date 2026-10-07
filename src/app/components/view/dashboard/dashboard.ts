import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { DashboardAccountsService } from '../../../services/dashboard-accounts/dashboard-accounts';
import { AccountSummary, DashboardCard } from '../../shared/dashboard-card/dashboard-card';

@Component({
  imports: [CurrencyPipe, DashboardCard],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly accountsService = inject(DashboardAccountsService);

  readonly accounts = signal<AccountSummary[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly firstName = signal('');
  readonly totalBalance = computed(() =>
    this.accounts().reduce((total, account) => total + account.balance, 0),
  );

  constructor() {
    const user = this.authService.currentUser;
    if (!user) {
      this.errorMessage.set('Log in to view the accounts associated with your profile.');
      this.loading.set(false);
      return;
    }

    this.firstName.set(user.firstName);
    void this.loadAccounts(user.userName);
  }

  private async loadAccounts(userName: string): Promise<void> {
    try {
      this.accounts.set(await this.accountsService.getAccountsForUser(userName));
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : 'We could not load your accounts. Please try again later.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}

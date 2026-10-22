import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { AuthService } from '../../../services/auth/auth';
import { DashboardAccountsService } from '../../../services/dashboard-accounts/dashboard-accounts';
import { AccountSummary } from '../../../dtos/dashboard-accounts/AccountSummary';
import { DashboardCard } from '../../shared/dashboard-card/dashboard-card';

@Component({
  imports: [NavigationBar, CurrencyPipe, DashboardCard],
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
    this.accounts().reduce((total, account) => total + account.balanceInCents, 0),
  );

  constructor() {
    const user = this.authService.currentUser;
    if (!user) {
      this.errorMessage.set('Log in to view the accounts associated with your profile.');
      this.loading.set(false);
      return;
    }

    this.firstName.set(user.firstName);
    void this.loadAccounts();
  }

  private async loadAccounts(): Promise<void> {
    try {
      this.accounts.set(await this.accountsService.getAccounts());
    } catch {
      this.errorMessage.set('We could not load your accounts. Please try again later.');
    } finally {
      this.loading.set(false);
    }
  }

  async refreshAccounts(): Promise<void> {
    try {
      this.accounts.set(await this.accountsService.getAccounts());
      this.errorMessage.set('');
    } catch {
      this.errorMessage.set('We could not refresh your accounts. Please try again later.');
    }
  }
}

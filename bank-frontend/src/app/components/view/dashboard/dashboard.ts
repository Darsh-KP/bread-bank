import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { AuthService } from '../../../services/auth/auth';
import { DashboardAccountsService, AccountRequest } from '../../../services/dashboard-accounts/dashboard-accounts';
import { AccountSummary, DashboardCard } from '../../shared/dashboard-card/dashboard-card';
import { ProfileInformationService } from '../../../services/profile-information/profile-information.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [NavigationBar, CurrencyPipe, DashboardCard],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly accountsService = inject(DashboardAccountsService);
  private readonly profileInformationService = inject(ProfileInformationService);

  readonly accounts = signal<AccountSummary[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly firstName = signal('');
  readonly totalBalance = computed(() =>
    this.accounts().reduce((total, account) => total + account.balance, 0),
  );

  //Used to keep memory from leaking when component destroyed
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const user = this.authService.currentUser;
    if (!user) {
      this.errorMessage.set('Log in to view the accounts associated with your profile.');
      this.loading.set(false);
      return;
    }

    //Load current user information from profile information service
    //If Observable as not be initalized then do it in the dashboard view
    this.profileInformationService.initCurrentUser(user.username)
      .pipe(
        // Runs when initCurrentUser succeeds
        tap((profile) => this.firstName.set(profile?.firstName || '')),
        // Automatically cleans up the subscription when the component destroys
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          //Load username data after the profile is active
          void this.loadAccounts(user.username);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'An error has occurred loading your account details. Please try logging out.');
          this.loading.set(false);
        }
      });
  }

  private async loadAccounts(username: string): Promise<void> {
    const request: AccountRequest = { username };
    try {
      this.accounts.set(await this.accountsService.getAccountsForUser(request));
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

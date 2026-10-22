import { Component, computed, inject, signal } from '@angular/core';
import {NavigationBar} from '../../shared/navigation-bar/navigation-bar';
import {TransactionButtonComponent} from '../../shared/money-transaction-modal/transaction-button';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput} from '@angular/material/input';
import { RecentTransactions } from '../../shared/recent-transactions/recent-transactions';
import {toSignal} from '@angular/core/rxjs-interop';
import {AccountService} from '../../../services/account-view/account.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, switchMap, combineLatest } from 'rxjs';
import {NotificationService} from '../../shared/notifications/notification.service';
import {AccountStateService} from './account-state/account-state.service';

@Component({
  imports: [
    NavigationBar,
    TransactionButtonComponent,
    MatIcon,
    MatButton,
    RouterLink,
    MatIconButton,
    MatFormField,
    MatInput,
    RecentTransactions,
  ],
  selector: 'account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {
  // Inject required dependencies
  private accountState = inject(AccountStateService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Get account number from selected account state service
  private readonly selectedAccountNumber = computed(() =>
    this.accountState.selectedAccountNumber()!,
  );

  // State variables for when operations updates visible fields
  private readonly localNicknameOverride = signal<string | null>(null);

  // Refresh account details trigger
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Call account service to load initial account details, and upon refresh
  private readonly accountDetails = toSignal(
    combineLatest([
      toObservable(this.selectedAccountNumber),
      this.refreshTrigger$
    ]).pipe(
      switchMap(() =>
        this.accountService
          .getAccountDetails({
            accountNumber: this.selectedAccountNumber(),
          })
          .pipe(
            catchError((error: Error) => {
              // Unable to load account details, show error
              this.notificationService.error(error.message);
              this.notificationService.error('Redirecting...');

              // Redirect to dashboard
              void this.router.navigate(['dashboard']);

              return of(null);
            }),
          ),
      ),
    ),
    {initialValue: null}
  );

  // Fields to be shown
  protected readonly accountName = computed(() => {
    return this.localNicknameOverride() ?? this.accountDetails()?.nickname ?? this.accountDetails()?.marketingName ?? 'Loading Account...';
  });

  protected readonly accountNumber = computed(
    () => this.accountDetails()?.accountNumber ?? this.selectedAccountNumber(),
  );

  protected readonly accountBalanceInCents = computed(() => {
    return this.accountDetails()?.balanceInCents ?? 0;
  });

  // String to store account nickname when being edited
  protected readonly updatedNickname = signal<string>('');

  // State variable to toggle name edit UI
  protected readonly isEditingName = signal<boolean>(false);

  // State variable to toggle account number
  protected readonly isAccountNumberVisible = signal<boolean>(false);

  // Helper method to convert transaction amount from cents to decimal
  protected readonly formattedBalance = computed(() => {
    return (this.accountBalanceInCents() / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  });

  // Method to toggle full account number
  protected readonly displayedAccountNumber = computed(() => {
    // Get the raw account number
    const raw = this.accountNumber().toString();

    // Check if account number is toggled to visible
    if (this.isAccountNumberVisible()) {
      // Format digits into groups of 4 with spaces
      return raw.replace(/(\d{4})(?=\d)/g, '\$1 ');
    }

    // Mask the account number and only show last 4 digits
    const lastFour = raw.slice(-4);
    return `•••• •••• ${lastFour}`;
  });

  // Start editing nickname, set input text to current account name
  protected startEditingNickname(): void {
    // Set the editing name to current name
    this.updatedNickname.set(this.accountName());

    // Started editing
    this.isEditingName.set(true);
  }

  // Save new nickname for current account
  protected saveNickname(): void {
    const sanitized = this.updatedNickname().trim();

    // Check if nickname is empty
    if (!sanitized) {
      this.notificationService.warning('Nickname cannot be empty.');
      return;
    }

    // Check if nickname is the same
    if (sanitized === this.accountName()) {
      this.isEditingName.set(false);
      return;
    }

    // Call account service to update nickname
    this.accountService
      .updateAccountNickname({
        accountNumber: this.accountNumber(),
        nickname: sanitized,
      })
      .subscribe({
        next: (response) => {
          // Success, show updated nickname
          this.localNicknameOverride.set(response.nickname);
          this.notificationService.success('Nickname updated successfully.');
          this.isEditingName.set(false);
        },
        error: (error: Error) => {
          // Unable to update nickname, show error
          this.notificationService.error(error.message);
          this.notificationService.error('Please try again later...');
        },
      });
  }

  // Discard any unsaved nickname
  protected cancelEditingNickname(): void {
    this.isEditingName.set(false);
  }

  // Toggle account number visibility state
  protected toggleAccountNumberVisibility(): void {
    this.isAccountNumberVisible.update((visible) => !visible);
  }

  // Update balance on a transaction completion
  onTransactionSuccess(event: boolean): void {
    // Check if the transaction was successful or not
    if (!event) return;

    // Refresh account details to reflect transaction
    this.refreshTrigger$.next();
  }
}

import {Component, computed, signal} from '@angular/core';
import {NavigationBar} from '../../shared/navigation-bar/navigation-bar';
import {TransactionButtonComponent} from '../../shared/money-transaction-modal/transaction-button';
import {RouterLink} from '@angular/router';
import {TransactionResponseDTO} from '../../../dtos/transaction/TransactionResponseDTO';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput} from '@angular/material/input';
import { RecentTransactions } from '../../shared/recent-transactions/recent-transactions';

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
  // State variables to store mock data
  accountName = signal<string>('Everyday Checking');
  rawAccountNumber = signal<string>('123456784812');
  accountBalanceCents = signal<number>(284576);

  // String to store account nickname when being edited
  updatedNickname = signal<string>('');

  // State variable to toggle name edit UI
  isEditingName = signal<boolean>(false);

  // State variable to toggle account number
  isAccountNumberVisible = signal<boolean>(false);

  // Helper method to convert transaction amount from cents to decimal
  readonly formattedBalance = computed(() => {
    return (this.accountBalanceCents() / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  });

  // Method to toggle full account number
  readonly displayedAccountNumber = computed(() => {
    // Get the raw account number
    const raw = this.rawAccountNumber();

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
  startEditingNickname(): void {
    // Set the editing name to current name
    this.updatedNickname.set(this.accountName());

    // Started editing
    this.isEditingName.set(true);
  }

  // Save new nickname for current account
  saveNickname(): void {
    const sanitized = this.updatedNickname().trim();

    if (sanitized) {
      this.accountName.set(sanitized);
    }

    // Editing is completed
    this.isEditingName.set(false);
  }

  // Discard any unsaved nickname
  cancelEditingNickname(): void {
    // Editing is canceled
    this.isEditingName.set(false);
  }

  // Toggle account number visibility state
  toggleAccountNumberVisibility(): void {
    this.isAccountNumberVisible.update((visible) => !visible);
  }

  // Update balance on a transaction completion
  onTransactionSuccess(event: TransactionResponseDTO): void {
    // Update balance to reflect transaction
    this.accountBalanceCents.update((currentBalanceCents) => {
      // Check the transaction type
      if (event.transactionType === 'DEPOSIT') {
        return currentBalanceCents + event.amountInCents;
      } else if (event.transactionType === 'WITHDRAW') {
        return Math.max(0, currentBalanceCents - event.amountInCents);
      }

      // Fallback
      return currentBalanceCents;
    });
  }
}

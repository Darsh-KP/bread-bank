import {Service, signal} from '@angular/core';

@Service()
export class AccountStateService {
  // Private writable signal
  private readonly selectedAccountNumberState = signal<number | null>(null);

  // Read-only public signal exposed to components
  readonly selectedAccountNumber = this.selectedAccountNumberState.asReadonly();

  // Method used by components to set the currently active account number
  setActiveAccount(accountNumber: number) {
    this.selectedAccountNumberState.set(accountNumber);
  }

  // Method to clear any selected account
  clearActiveAccount(): void {
    this.selectedAccountNumberState.set(null);
  }
}

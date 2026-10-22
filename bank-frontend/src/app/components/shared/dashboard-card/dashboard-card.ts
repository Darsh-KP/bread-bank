import { CurrencyPipe } from '@angular/common';
import {Component, inject, input, output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TransactionButtonComponent } from '../money-transaction-modal/transaction-button';
import { AccountSummary } from '../../../dtos/dashboard-accounts/AccountSummary';
import {AccountStateService} from '../../view/account/account-state/account-state.service';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe,
    TransactionButtonComponent,
  ],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  accountStateService = inject(AccountStateService);

  readonly account = input.required<AccountSummary>();
  readonly transactionCompleted = output<void>();
  constructor(private router: Router) {}

  goToAccount() {
    this.router.navigate(['/account']);
    this.accountStateService.setActiveAccount(this.account().accountNumber);
  }

  onTransactionSuccess(success: boolean): void {
    if (success) {
      // this will notify parent component about successful transaction
      this.transactionCompleted.emit();
    }
  }
}

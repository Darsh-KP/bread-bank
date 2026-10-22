import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TransactionButtonComponent } from '../money-transaction-modal/transaction-button';
import { AccountSummary } from '../../../dtos/dashboard-accounts/AccountSummary';

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
  readonly account = input.required<AccountSummary>();
  readonly transactionCompleted = output<void>();
  constructor(private router: Router) {}

  goToAccount() {
    this.router.navigate(['/account']);
  }

  onTransactionSuccess(success: boolean): void {
    if (success) {
      // this will notify parent component about successful transaction
      this.transactionCompleted.emit();
    }
  }
}

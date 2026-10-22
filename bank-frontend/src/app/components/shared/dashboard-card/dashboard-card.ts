import { CurrencyPipe } from '@angular/common';
import {Component, inject, input} from '@angular/core';
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
  constructor(private router: Router) {}

  goToAccount() {
    this.router.navigate(['/account']);
    this.accountStateService.setActiveAccount(this.account().accountNumber);
  }
}

import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TransactionButtonComponent } from '../money-transaction-modal/transaction-button';

export interface AccountSummary {
  id: number;
  accountType: string;
  lastFour: string;
  balance: number;
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe,
    TransactionButtonComponent
  ],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  readonly account = input.required<AccountSummary>();
}

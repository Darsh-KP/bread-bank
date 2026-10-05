import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export interface AccountSummary {
  id: number;
  accountType: string;
  lastFour: string;
  balance: number;
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CurrencyPipe],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  @Input() account!: AccountSummary;
}

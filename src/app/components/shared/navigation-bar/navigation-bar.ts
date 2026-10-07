import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface AccountMenuItem {
  label: string;
  route: string;
  description?: string;
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
  ],
  styleUrl: './navigation-bar.css',
  templateUrl: './navigation-bar.html',
})

export class NavigationBar {
  readonly mobileNavOpen = signal(false);

  readonly accountItems: AccountMenuItem[] = [
    { label: 'Checking', route: '/accounts/checking', description: 'Primary checking account' },
    { label: 'Savings', route: '/accounts/savings', description: 'High-yield savings' },
    { label: 'Credit', route: '/accounts/credit', description: 'Rewards credit line' },
  ];

  toggleMobileNav(): void {
    this.mobileNavOpen.update((isOpen) => !isOpen);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  logout(): void {
    console.log('Logout triggered');
  }
}

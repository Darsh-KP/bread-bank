import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
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
    this.auth.currentUser = null;
    void this.router.navigate(['/']);
  }
}

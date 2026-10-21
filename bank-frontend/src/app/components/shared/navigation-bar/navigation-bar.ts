import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { AccountSummary } from '../dashboard-card/dashboard-card';
import { DashboardAccountsService } from '../../../services/dashboard-accounts/dashboard-accounts';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    CurrencyPipe,
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
  private readonly accountsService = inject(DashboardAccountsService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly mobileNavOpen = signal(false);
  readonly accountItems = signal<AccountSummary[]>([]);
  readonly accountsLoading = signal(false);
  readonly accountsError = signal('');

  private accountsLoaded = false;

  async loadAccountItems(): Promise<void> {
    if (this.accountsLoaded || this.accountsLoading()) return;

    const username = this.auth.currentUser?.username;
    if (!username) {
      this.accountsError.set('Log in to view your accounts.');
      return;
    }

    this.accountsLoading.set(true);
    this.accountsError.set('');

    try {
      this.accountItems.set(await this.accountsService.getAccountsForUser({ username }));
      this.accountsLoaded = true;
    } catch (error) {
      this.accountsError.set(
        error instanceof Error ? error.message : 'Could not load your accounts. Please try again.',
      );
    } finally {
      this.accountsLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.logout();
      this.notificationService.success('Successfully logged out.');
    } catch {
      this.notificationService.error(
        'Could not confirm logout with the server. Your local session was cleared, but the refresh session may still be active.',
        );
    } finally {
      await this.router.navigate(['/']);
    }
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((isOpen) => !isOpen);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}

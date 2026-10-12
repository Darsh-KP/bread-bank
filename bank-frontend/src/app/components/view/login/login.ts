import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth/auth';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthFeatures } from '../../shared/auth-features/auth-features';

@Component({
  imports: [RouterLink, AuthFeatures, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  credentials: LoginRequest = { userName: '', password: '' };
  submitting = signal(false);
  showPassword = signal(false);

  async login(): Promise<void> {
    if (this.submitting()) return;
    this.submitting.set(true);

    try {
      await this.authService.login(this.credentials);

      this.notifications.success('Successfully logged in!');

      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.notifications.error(
        error instanceof Error ? error.message : 'Could not log in. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}

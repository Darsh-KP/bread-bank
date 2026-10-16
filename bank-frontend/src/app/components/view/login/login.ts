import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth/auth';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthFeatures } from '../../shared/auth-features/auth-features';
import { HttpErrorResponse } from '@angular/common/http';

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

  credentials: LoginRequest = { username: '', password: '' };
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
      let message = 'Could not log in. Please try again later.';
      if (error instanceof HttpErrorResponse) {
        if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.status === 0) {
          message = 'Could not connect to the server.';
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      this.notifications.error(
        message,
      );
    } finally {
      this.submitting.set(false);
    }
  }
}

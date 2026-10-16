import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthFeatures } from '../../shared/auth-features/auth-features';
import { RegistrationRequest, AuthService } from '../../../services/auth/auth';
import { validatePassword } from '../../../../utils/passwordValidation';
import { emailPattern, phonePattern, validate } from '../../../../utils/regExps';
import { NotificationService } from '../../shared/notifications/notification.service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, AuthFeatures],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  step = signal(1);
  submitting = signal(false);
  showPassword = signal(false);
  confirmPassword = '';

  registration: RegistrationRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  };

  nextStep(): void {
    const firstStepFields = ['firstName', 'lastName', 'email', 'phone'];
    if (
      firstStepFields.some((field) => !this.registration[field as keyof RegistrationRequest].trim())
    ) {
      this.notifications.error('Please complete all fields before continuing.');
      return;
    }
    if (!validate(this.registration.email, emailPattern)) {
      this.notifications.error('Please enter a valid email address.');
      return;
    }
    if (!validate(this.registration.phone, phonePattern)) {
      this.notifications.error('Please enter a valid phone number.');
      return;
    }
    this.step.set(2);
  }

  previousStep(): void {
    this.step.set(1);
  }

  async register(): Promise<void> {
    if (this.submitting()) return;
    if (this.step() === 1) {
      this.nextStep();
      return;
    }
    if (!this.registration.username.trim()) {
      this.notifications.error('Please enter a username.');
      return;
    }
    const passwordErrors = validatePassword(this.registration.password);
    if (passwordErrors.length) {
      this.notifications.error(
        'Password requirements:\n' + passwordErrors.map((error) => '• ' + error).join('\n'),
      );
      return;
    }
    if (this.registration.password !== this.confirmPassword) {
      this.notifications.error('Passwords do not match.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.authService.register(this.registration);

      this.notifications.success('Your account was created successfully.', 1500);

      await this.router.navigate(['/']);
    } catch (error) {
      let message = 'Could not register. Please try again later.';
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

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { normalizePhone } from '../../../utils/normalization';
import { emailPattern, phonePattern, validate } from '../../../utils/regExps';
import { validatePassword } from '../../../utils/passwordValidation';

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisteredUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface MockRegisteredUser extends RegisteredUser {
  passwordHash: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private users?: Promise<MockRegisteredUser[]>;
  currentUser: RegisteredUser | null = null;

  async login(request: LoginRequest): Promise<RegisteredUser> {
    const username = request.username.trim().toLowerCase();
    if (!username || !request.password) {
      throw new Error('Please enter your username and password.');
    }

    await this.delay(500);

    const users = await this.loadUsers();

    const user = users.find(
      (user) =>
        user.username.trim().toLowerCase() === username && user.passwordHash === request.password,
    );
    if (!user) throw new Error('Invalid username or password.');

    const { passwordHash, ...profile } = user;
    this.currentUser = profile;

    return { ...profile };
  }

  async changePassword(request: { oldPassword: string; newPassword: string }): Promise<void> {
    const currentUser = this.currentUser;
    if (!currentUser) throw new Error('Please sign in to change your password.');

    const users = await this.loadUsers();
    if (this.currentUser !== currentUser) {
      throw new Error('Your session changed. Please try again.');
    }
    const user = users.find((candidate) => candidate.username === currentUser.username);
    if (!user || user.passwordHash !== request.oldPassword) {
      throw new Error('Incorrect current password.');
    }
    if (request.oldPassword === request.newPassword) {
      throw new Error('New password cannot be the same as your current password.');
    }
    const errors = validatePassword(request.newPassword);
    if (errors.length) throw new Error(errors[0]);

    user.passwordHash = request.newPassword;
  }

  private loadUsers(): Promise<MockRegisteredUser[]> {
    return (this.users ??= firstValueFrom(
      this.http.get<MockRegisteredUser[]>('/mock-data/users.json'),
    ).catch(() => {
      this.users = undefined;
      throw new Error('Could not load account data. Please try again.');
    }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async register(request: RegistrationRequest): Promise<RegisteredUser> {
    await this.delay(500);

    const firstName = request.firstName.trim();
    const lastName = request.lastName.trim();
    const username = request.username.trim();
    const email = request.email.trim().toLowerCase();
    const phone = normalizePhone(request.phone);

    if (!firstName || !lastName || !username || !email || !phone || !request.password) {
      throw new Error('All registration fields are required.');
    }
    if (!validate(email, emailPattern)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!validate(request.phone, phonePattern)) {
      throw new Error('Please enter a valid phone number.');
    }
    const passwordErrors = validatePassword(request.password);
    if (passwordErrors.length > 0) {
      throw new Error(passwordErrors[0]);
    }

    const users = await this.loadUsers();
    if (users.some((user) => user.username.trim().toLowerCase() === username.toLowerCase())) {
      throw new Error('This username is already taken.');
    }
    if (users.some((user) => user.email.trim().toLowerCase() === email)) {
      throw new Error('This email is already taken.');
    }
    if (users.some((user) => normalizePhone(user.phone) === phone)) {
      throw new Error('This phone number is already taken.');
    }

    const user: MockRegisteredUser = {
      username,
      firstName,
      lastName,
      email,
      phone,
      passwordHash: request.password,
    };
    users.push(user);

    const { passwordHash: _passwordHash, ...registeredUser } = user;
    return { ...registeredUser };
  }
}

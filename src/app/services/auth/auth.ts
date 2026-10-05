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
  userName: string;
  password: string;
}

export interface RegisteredUser {
  userName: string;
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
    const userName = request.userName.trim();
    const email = request.email.trim().toLowerCase();
    const phone = normalizePhone(request.phone);

    if (!firstName || !lastName || !userName || !email || !phone || !request.password) {
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
    if (users.some((user) => user.userName.trim().toLowerCase() === userName.toLowerCase())) {
      throw new Error('This username is already taken.');
    }
    if (users.some((user) => user.email.trim().toLowerCase() === email)) {
      throw new Error('This email is already taken.');
    }
    if (users.some((user) => normalizePhone(user.phone) === phone)) {
      throw new Error('This phone number is already taken.');
    }

    const user: MockRegisteredUser = {
      userName,
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

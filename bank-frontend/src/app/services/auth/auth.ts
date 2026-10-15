import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from } from 'rxjs';
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

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface RegisterResponse {
  userResponse: User;
}



@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  currentUser: User | null = null;

  async login(request: LoginRequest): Promise<User> {
    const username = request.username.trim().toLowerCase();
    if (!username || !request.password) {
      throw new Error('Please enter your username and password.');
    }


  }

  async register(request: RegistrationRequest): Promise<RegisterResponse> {
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

    const registerResponse = await firstValueFrom(this.http.post<RegisterResponse>(`http://localhost:8080/auth/register`, {
      ...request,
      firstName,
      lastName,
      username,
      email,
      phone
    }));
    return registerResponse;
  }
}

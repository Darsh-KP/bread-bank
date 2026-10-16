import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { normalizePhone } from '../../../utils/normalization';
import { emailPattern, phonePattern, validate } from '../../../utils/regExps';
import { validatePassword } from '../../../utils/passwordValidation';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserDto,
} from '../../dtos/auth';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private accessToken: string | null = null
  currentUser: UserDto | null = null;

  getAccessToken() {
    return this.accessToken;
  }

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    const username = request.username.trim().toLowerCase();
    if (!username || !request.password) {
      throw new Error('Please enter your username and password.');
    }

    const loginResponse = await firstValueFrom(this.http.post<LoginResponseDto>(`http://localhost:8080/auth/login`, {
      ...request,
      username,
    }));
    this.accessToken = loginResponse.accessToken;
    this.currentUser = loginResponse.userResponse;
    return loginResponse;
  }

  async register(request: RegisterRequestDto): Promise<RegisterResponseDto> {
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

    const registerResponse = await firstValueFrom(this.http.post<RegisterResponseDto>(`http://localhost:8080/auth/register`, {
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

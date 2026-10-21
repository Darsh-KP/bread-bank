import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AllAccountsResponseDTO } from '../../dtos/dashboard-accounts/AllAccountsResponseDTO';
import { AccountSummary } from '../../dtos/dashboard-accounts/AccountSummary';

@Injectable({ providedIn: 'root' })
export class DashboardAccountsService {
  private readonly http = inject(HttpClient);
  private readonly dashboardUrl = 'http://localhost:8080/dashboard';

  async getAccounts(): Promise<AccountSummary[]> {
    const response = await firstValueFrom(
      this.http.get<AllAccountsResponseDTO>(this.dashboardUrl),
    );

    return response.accounts;
  }
}

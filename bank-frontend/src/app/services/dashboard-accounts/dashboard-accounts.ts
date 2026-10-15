import { inject, Injectable } from '@angular/core';
import { AccountSummary } from '../../components/shared/dashboard-card/dashboard-card';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// TODO: replace these interfaces with the AllAccountsRequestDTO, AllAccountsResponseDTO, and AccountSummary, which
//  would then change the implementation
export interface AccountRequest {
  userName: string;
}

interface MockAccount extends AccountSummary {
  userName: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardAccountsService {
  private readonly http = inject(HttpClient);
  private accounts?: Promise<MockAccount[]>;

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadAccounts(): Promise<MockAccount[]> {
    return (this.accounts ??= firstValueFrom(
      this.http.get<MockAccount[]>('/mock-data/accounts.json'),
    ).catch(() => {
      this.accounts = undefined;
      throw new Error('Could not load account data. Please try again.');
    }));
  }

  async getAccountsForUser(request: AccountRequest): Promise<AccountSummary[]> {
    const normalizedUserName = request.userName.trim().toLowerCase();
    if (normalizedUserName === null || normalizedUserName === '') {
      throw new Error('Invalid request body');
    }

    await this.delay(500);

    const accounts = await this.loadAccounts();

    return accounts.filter(
      (account) => account.userName.trim().toLowerCase() === normalizedUserName,
    ).map(
      ({ userName: _userName, ...account }) => ({ ...account })
    );
  }
}

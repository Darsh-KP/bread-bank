import { Injectable } from '@angular/core';
import { AccountSummary } from '../../components/shared/dashboard-card/dashboard-card';

interface MockAccount extends AccountSummary {
  userName: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: 1,
    userName: 'itsYaBreadBoi',
    accountType: 'Everyday Checking',
    lastFour: '4821',
    balance: 2845.76,
  },
  {
    id: 2,
    userName: 'itsYaBreadBoi',
    accountType: 'High-Yield Savings',
    lastFour: '9073',
    balance: 12750.4,
  },
  {
    id: 3,
    userName: 'yeasterSunday',
    accountType: 'Everyday Checking',
    lastFour: '1638',
    balance: 1932.18,
  },
  {
    id: 4,
    userName: 'yeasterSunday',
    accountType: 'Rainy Day Savings',
    lastFour: '7410',
    balance: 8340.92,
  },
  {
    id: 5,
    userName: 'yeasterSunday',
    accountType: 'Travel Savings',
    lastFour: '2556',
    balance: 2160.5,
  },
];

@Injectable({ providedIn: 'root' })
export class DashboardAccountsService {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAccountsForUser(userName: string): Promise<AccountSummary[]> {
    await this.delay(500);

    const normalizedUserName = userName.trim().toLowerCase();
    return MOCK_ACCOUNTS.filter(
      (account) => account.userName.trim().toLowerCase() === normalizedUserName,
    ).map(({ userName: _userName, ...account }) => ({ ...account }));
  }
}

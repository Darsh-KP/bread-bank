import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { TransactionHistoryService } from '../../../services/transaction-history/transaction-history.service';
import { TransactionHistoryItemDto } from '../../../dtos/transaction-history/TransactionHistoryItemDto';
import { AccountStateService } from '../../view/account/account-state/account-state.service';
import { RecentTransactions } from './recent-transactions';

const item = (id: string, createdAt: string): TransactionHistoryItemDto => ({
  id,
  type: 'DEPOSIT',
  amount: 10,
  balanceAfter: 10,
  description: `row ${id}`,
  createdAt,
});

function setup(accountNumber: number | null, getHistory: ReturnType<typeof vi.fn>, limit?: number) {
  TestBed.configureTestingModule({
    imports: [RecentTransactions],
    providers: [
      provideRouter([]),
      { provide: AccountStateService, useValue: { selectedAccountNumber: () => accountNumber } },
      { provide: TransactionHistoryService, useValue: { getHistory } },
    ],
  });
  const fixture = TestBed.createComponent(RecentTransactions);
  if (limit !== undefined) fixture.componentRef.setInput('limit', limit);
  fixture.detectChanges(); // runs the component's effect, which starts the request
  return fixture;
}

describe('RecentTransactions', () => {
  it('requests the selected account with the limit', async () => {
    const getHistory = vi.fn().mockResolvedValue([]);
    const fixture = setup(123456, getHistory);
    await fixture.whenStable();

    expect(getHistory).toHaveBeenCalledWith({ accountNumber: 123456, limit: 5 });
    expect(fixture.componentInstance.error()).toBe('');
  });

  it('shows the newest transactions first, cut to the limit', async () => {
    const getHistory = vi.fn().mockResolvedValue([
      item('1', '2026-10-20T10:00:00Z'),
      item('3', '2026-10-22T10:00:00Z'),
      item('2', '2026-10-21T10:00:00Z'),
    ]);
    const fixture = setup(123456, getHistory, 2);
    await fixture.whenStable();

    expect(fixture.componentInstance.recent().map((t) => t.id)).toEqual(['3', '2']);
  });

  it('asks for an account when none is selected', async () => {
    const getHistory = vi.fn();
    const fixture = setup(null, getHistory);
    await fixture.whenStable();

    expect(getHistory).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error()).toBe('Choose an account to see its recent transactions.');
  });

  it('shows an error when the request fails', async () => {
  const getHistory = vi.fn().mockRejectedValue(new Error('boom'));
  const fixture = setup(123456, getHistory);

  await vi.waitFor(() =>
    expect(fixture.componentInstance.error()).toBe("We couldn't load your recent transactions."),
  );
});

  it('reload() fetches again', async () => {
    const getHistory = vi.fn().mockResolvedValue([]);
    const fixture = setup(123456, getHistory);
    await fixture.whenStable();

    fixture.componentInstance.reload();
    await fixture.whenStable();

    expect(getHistory).toHaveBeenCalledTimes(2);
  });
});
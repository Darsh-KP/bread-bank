import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { TransactionHistoryService } from '../../../services/transaction-history/transaction-history.service';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { AccountStateService } from '../account/account-state/account-state.service';
import { TransactionHistory } from './transaction-history';

// Stand-in for the nav bar, which has its own dependencies and isn't what this spec tests.
@Component({ selector: 'app-navigation-bar', template: '' })
class NavigationBarStub {}

function setup(accountNumber: number | null, getHistory: ReturnType<typeof vi.fn>) {
  TestBed.configureTestingModule({
    imports: [TransactionHistory],
    providers: [
      provideRouter([]),
      { provide: AccountStateService, useValue: { selectedAccountNumber: () => accountNumber } },
      { provide: TransactionHistoryService, useValue: { getHistory } },
    ],
  });
  TestBed.overrideComponent(TransactionHistory, {
    remove: { imports: [NavigationBar] },
    add: { imports: [NavigationBarStub] },
  });

  return TestBed.createComponent(TransactionHistory);
}

describe('TransactionHistory', () => {
  it('asks for an account when none is selected', async () => {
    const getHistory = vi.fn();
    const fixture = setup(null, getHistory);
    await fixture.whenStable();

    expect(getHistory).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error()).toBe('Choose an account to see its transaction history.');
  });

  it('loads the history for the selected account', async () => {
    const getHistory = vi.fn().mockResolvedValue([]);
    const fixture = setup(123456, getHistory);
    await fixture.whenStable();

    expect(getHistory).toHaveBeenCalledWith({ accountNumber: 123456 });
    expect(fixture.componentInstance.error()).toBe('');
  });

  it('shows a friendly message on 404', async () => {
    const getHistory = vi.fn().mockRejectedValue(new HttpErrorResponse({ status: 404 }));
    const fixture = setup(123456, getHistory);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe("We couldn't find that account.");
  });
});
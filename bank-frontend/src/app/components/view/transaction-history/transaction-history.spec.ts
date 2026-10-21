import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { TransactionHistoryService } from '../../../services/transaction-history/transaction-history.service';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { TransactionHistory } from './transaction-history';
import { Component } from '@angular/core';

@Component({ selector: 'app-navigation-bar', template: '' })
class NavigationBarStub {}

function setup(query: Record<string, string>, getHistory: ReturnType<typeof vi.fn>) {
  TestBed.configureTestingModule({
    imports: [TransactionHistory],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(query) } } },
      { provide: TransactionHistoryService, useValue: { getHistory } },
    ],
  });
  // The nav bar has its own dependencies; this spec is only about the history page.
  TestBed.overrideComponent(TransactionHistory, {
    remove: { imports: [NavigationBar] },
    add: { imports: [NavigationBarStub] },
  });

  const fixture = TestBed.createComponent(TransactionHistory);
  return fixture;
}

describe('TransactionHistory', () => {
  it('asks for an account when none is in the URL', async () => {
    const getHistory = vi.fn();
    const fixture = setup({}, getHistory);
    await fixture.whenStable();

    expect(getHistory).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error()).toBe('Choose an account to see its transaction history.');
  });

  it('loads the history for the account in the URL', async () => {
    const getHistory = vi.fn().mockResolvedValue([]);
    const fixture = setup({ accountNumber: '123456' }, getHistory);
    await fixture.whenStable();

    expect(getHistory).toHaveBeenCalledWith({ accountNumber: 123456 });
    expect(fixture.componentInstance.error()).toBe('');
  });

  it('shows a friendly message on 404', async () => {
    const getHistory = vi.fn().mockRejectedValue(new HttpErrorResponse({ status: 404 }));
    const fixture = setup({ accountNumber: '123456' }, getHistory);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe("We couldn't find that account.");
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Transaction, TransactionService } from '../../../services/transaction_history';
import { RecentTransactions } from './recent-transactions';

/** Builds `count` transactions on consecutive days, in a scrambled order. */
function makeTransactions(count: number): Transaction[] {
  const list: Transaction[] = Array.from({ length: count }, (_, i) => ({
    id: `t_${i}`,
    accountId: 'acc_1',
    type: i % 2 === 0 ? 'DEPOSIT' : 'WITHDRAW',
    amount: 10 + i,
    balanceAfter: 100 + i,
    description: `Item ${i}`,
    createdAt: new Date(Date.UTC(2026, 8, 1 + i, 12)).toISOString(), // i = 0 is the oldest
  }));
  return list.reverse().sort((a, b) => (a.id < b.id ? 1 : -1)); // not in date order
}

describe('RecentTransactions', () => {
  let fixture: ComponentFixture<RecentTransactions>;

  async function setup(getTransactions: () => Promise<Transaction[]>) {
    await TestBed.configureTestingModule({
      imports: [RecentTransactions],
      providers: [{ provide: TransactionService, useValue: { getTransactions } }, provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(RecentTransactions);
    fixture.detectChanges();
  }

  async function settle() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  }

  const items = () => Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.item'));

  it('shows a loading message first', async () => {
    await setup(() => new Promise<Transaction[]>(() => {}));
    expect(fixture.nativeElement.textContent).toContain('Loading recent transactions');
  });

  it('shows only the 5 most recent transactions, newest first', async () => {
    await setup(() => Promise.resolve(makeTransactions(8)));
    await settle();
    const rows = items();
    expect(rows.length).toBe(5);
    expect(rows[0].textContent).toContain('Item 7'); // the newest
    expect(rows[4].textContent).toContain('Item 3');
    expect(fixture.nativeElement.textContent).not.toContain('Item 2');
  });

  it('shows everything when there are fewer than 5', async () => {
    await setup(() => Promise.resolve(makeTransactions(3)));
    await settle();
    expect(items().length).toBe(3);
  });

  it('marks money out in red and money in in green', async () => {
    await setup(() => Promise.resolve(makeTransactions(2)));
    await settle();
    const amounts = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.amount'));
    // newest is Item 1 (a withdrawal), then Item 0 (a deposit)
    expect(amounts[0].classList.contains('out')).toBe(true);
    expect(amounts[0].textContent).toContain('-$11.00');
    expect(amounts[1].classList.contains('in')).toBe(true);
    expect(amounts[1].textContent).toContain('$10.00');
  });

  it('has a "Show all transactions" button that goes to /history', async () => {
    await setup(() => Promise.resolve(makeTransactions(6)));
    await settle();
    const button: HTMLAnchorElement = fixture.nativeElement.querySelector('a.btn');
    expect(button.textContent).toContain('Show all transactions');
    expect(button.getAttribute('href')).toBe('/history');
  });

  it('can be pointed at a different page and show a different number', async () => {
    await setup(() => Promise.resolve(makeTransactions(8)));
    fixture.componentRef.setInput('limit', 3);
    fixture.componentRef.setInput('viewAllLink', '/somewhere-else');
    await settle();
    expect(items().length).toBe(3);
    expect(fixture.nativeElement.querySelector('a.btn').getAttribute('href')).toBe('/somewhere-else');
  });

  it('shows an empty message and no button when there are no transactions', async () => {
    await setup(() => Promise.resolve([]));
    await settle();
    expect(fixture.nativeElement.textContent).toContain('No transactions yet');
    expect(fixture.nativeElement.querySelector('a.btn')).toBeNull();
  });

  it('shows an error message when loading fails', async () => {
    await setup(() => Promise.reject(new Error('boom')));
    await settle();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
  });
});

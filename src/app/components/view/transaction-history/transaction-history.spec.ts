import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transaction, TransactionService } from '../../../services/transaction';
import { TransactionHistory } from './transaction-history';

const SAMPLE: Transaction[] = [
  {
    id: 't_1',
    accountId: 'acc_1',
    type: 'DEPOSIT',
    amount: 50,
    balanceAfter: 150,
    description: 'Paycheck',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 't_2',
    accountId: 'acc_1',
    type: 'WITHDRAW',
    amount: 25,
    balanceAfter: 125,
    description: 'Groceries',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
];

describe('TransactionHistory', () => {
  let fixture: ComponentFixture<TransactionHistory>;

  async function setup(getTransactions: () => Promise<Transaction[]>) {
    await TestBed.configureTestingModule({
      imports: [TransactionHistory],
      providers: [{ provide: TransactionService, useValue: { getTransactions } }],
    }).compileComponents();
    fixture = TestBed.createComponent(TransactionHistory);
    fixture.detectChanges();
  }

  async function settle() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  }

  it('should create and show the heading', async () => {
    await setup(() => Promise.resolve(SAMPLE));
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Transaction history');
  });

  it('shows a loading message first', async () => {
    await setup(() => new Promise<Transaction[]>(() => {}));
    expect(fixture.nativeElement.textContent).toContain('Loading transactions');
  });

  it('shows the grid with one row per transaction', async () => {
    await setup(() => Promise.resolve(SAMPLE));
    await settle();
    expect(fixture.nativeElement.querySelector('ag-grid-angular')).toBeTruthy();
    expect(fixture.componentInstance.rows().length).toBe(2);
  });

  it('gives each row a signed amount (negative for money out)', async () => {
    await setup(() => Promise.resolve(SAMPLE));
    await settle();
    const [deposit, withdrawal] = fixture.componentInstance.rows();
    expect(deposit.signedAmount).toBe(50);
    expect(withdrawal.signedAmount).toBe(-25);
  });

  it('defines the expected columns', async () => {
    await setup(() => Promise.resolve(SAMPLE));
    const headers = fixture.componentInstance.columnDefs.map((c) => c.headerName);
    expect(headers).toEqual(['Date', 'Description', 'Type', 'Amount', 'Balance']);
  });

  it('shows an empty state when there are no transactions', async () => {
    await setup(() => Promise.resolve([]));
    await settle();
    expect(fixture.nativeElement.textContent).toContain('No transactions yet');
  });

  it('shows an error message when loading fails', async () => {
    await setup(() => Promise.reject(new Error('boom')));
    await settle();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransferService } from './transfer.service';
import { DashboardAccountsService } from './dashboard-accounts/dashboard-accounts';

describe('TransferService', () => {
  let service: TransferService;
  let httpMock: HttpTestingController;

  const mockAccounts = [
    {
      accountNumber: 1001,
      marketingName: 'Checking',
      balanceInCents: 250000,
    },
    {
      accountNumber: 1002,
      marketingName: 'Savings',
      balanceInCents: 500000,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferService,
        DashboardAccountsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TransferService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads accounts from the backend', async () => {
    const promise = service.getAccounts();

    const request = httpMock.expectOne('http://localhost:8080/dashboard');
    expect(request.request.method).toBe('GET');

    request.flush({ accounts: mockAccounts });

    const accounts = await promise;

    expect(accounts).toEqual([
      { id: '1001', name: 'Checking', balance: 2500 },
      { id: '1002', name: 'Savings', balance: 5000 },
    ]);
  });

  it('submits a transfer in cents and reloads balances', async () => {
    const promise = service.transfer({
      fromAccountId: '1001',
      toAccountId: '1002',
      amount: 25.5,
    });

    const request = httpMock.expectOne('http://localhost:8080/transfer');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      fromAccountNumber: 1001,
      toAccountNumber: 1002,
      amountInCents: 2550,
    });

    request.flush({
      isSuccessful: true,
      amountInCents: 2550,
    });

    // Allow the promise continuation to issue the dashboard request.
    await Promise.resolve();

    const dashboardRequest = httpMock.expectOne('http://localhost:8080/dashboard');
    dashboardRequest.flush({
      accounts: [
        { ...mockAccounts[0], balanceInCents: 247450 },
        { ...mockAccounts[1], balanceInCents: 502550 },
      ],
    });

    const accounts = await promise;

    expect(accounts[0].balance).toBe(2474.5);
    expect(accounts[1].balance).toBe(5025.5);
  });

  it('rejects transfers between the same account', async () => {
    await expect(
      service.transfer({
        fromAccountId: '1001',
        toAccountId: '1001',
        amount: 25,
      }),
    ).rejects.toThrow('Source and destination accounts must be different.');
  });

  it('rejects invalid transfer amounts', async () => {
    await expect(
      service.transfer({
        fromAccountId: '1001',
        toAccountId: '1002',
        amount: -10,
      }),
    ).rejects.toThrow('Transfer amount must be greater than zero.');
  });

  it('rejects amounts with more than two decimal places', async () => {
    await expect(
      service.transfer({
        fromAccountId: '1001',
        toAccountId: '1002',
        amount: 10.123,
      }),
    ).rejects.toThrow('Please enter a valid amount with at most two decimal places.');
  });

  it('handles backend transfer failures', async () => {
    const promise = service.transfer({
      fromAccountId: '1001',
      toAccountId: '1002',
      amount: 25,
    });

    const request = httpMock.expectOne('http://localhost:8080/transfer');

    request.flush({
      isSuccessful: false,
      amountInCents: 2500,
    });

    await expect(promise).rejects.toThrow('Transfer could not be completed.');
  });
});

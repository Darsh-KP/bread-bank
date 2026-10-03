import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns transactions, newest first', async () => {
    const list = await service.getTransactions();
    expect(list.length).toBeGreaterThan(1);
    expect(new Date(list[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(list[1].createdAt).getTime(),
    );
  });
});
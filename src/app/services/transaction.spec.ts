import { TestBed } from '@angular/core/testing'; // import the Angular testing utilities for setting up the test environment

import { TransactionService } from './transaction'; // import the TransactionService to be tested

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => { // sets up the testing module and injects the TransactionService before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => { // tests that the TransactionService is successfully created
    expect(service).toBeTruthy();
  });

  it('returns transactions, newest first', async () => { // tests that the transactions are returned in descending order by creation date
    const list = await service.getTransactions();
    expect(list.length).toBeGreaterThan(1);
    expect(new Date(list[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(list[1].createdAt).getTime(),
    );
  });
});
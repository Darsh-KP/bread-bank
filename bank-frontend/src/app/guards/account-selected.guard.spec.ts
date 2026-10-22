import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { accountSelectedGuard } from './account-selected.guard';

describe('accountSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => accountSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

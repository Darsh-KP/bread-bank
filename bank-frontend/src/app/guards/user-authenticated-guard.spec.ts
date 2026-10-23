import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { userAuthenticatedGuard } from './user-authenticated-guard';

describe('userAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

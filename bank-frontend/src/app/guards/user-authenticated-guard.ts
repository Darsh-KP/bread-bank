import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth';

export const userAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser == null) {
    // Redirect to dashboard
    void router.navigate(['']);

    return false;
  }

  return true;
};

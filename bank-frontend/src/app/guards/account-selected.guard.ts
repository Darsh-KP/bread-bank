import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {NotificationService} from '../components/shared/notifications/notification.service';
import {AccountStateService} from '../components/view/account/account-state/account-state.service';

export const accountSelectedGuard: CanActivateFn = () => {
  const accountState = inject(AccountStateService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  if (accountState.selectedAccountNumber() == null) {
    // No account was selected, show error
    notificationService.error('No account selected. Redirecting...');

    // Redirect to dashboard
    void router.navigate(['dashboard']);

    return false;
  }

  return true;
};

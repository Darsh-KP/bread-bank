import { Routes } from '@angular/router';
import { ProfileSettings } from './components/view/profile_settings/profile-settings';

export const routes: Routes = [
  {
    path: 'history',
    loadComponent: () =>
      import('./components/view/transaction-history/transaction-history').then((m) => m.TransactionHistory),
  },
  {
    path: "profile-settings",
    component: ProfileSettings
  }
];

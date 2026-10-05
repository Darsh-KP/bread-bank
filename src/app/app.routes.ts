import { Routes } from '@angular/router';
import { Login } from './components/view/login/login';
import { ProfileSettings } from './components/view/profile_settings/profile-settings';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
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

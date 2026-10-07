import { Routes } from '@angular/router';
import { Login } from './components/view/login/login';
import { ProfileSettings } from './components/view/profile_settings/profile-settings';
import { Register } from './components/view/register/register';
import { CreateAccount } from './components/view/create-account/create-account';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/view/transaction-history/transaction-history').then(
        (m) => m.TransactionHistory,
      ),
  },
  {
    path: 'profile-settings',
    loadComponent: () =>
      import('./components/view/profile_settings/profile-settings').then(
        (m) => m.ProfileSettings
      ),
  },
  {
    path: 'create-account',
    component: CreateAccount,
  },
  {
    path: 'transfer',
    loadComponent: () => import('./components/view/transfer/transfer').then(
      (m) => m.Transfer
    ),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/view/dashboard/dashboard').then(
      (m) => m.Dashboard
    ),
  },
];

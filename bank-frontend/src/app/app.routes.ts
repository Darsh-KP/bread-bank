import { Routes } from '@angular/router';
import { Login } from './components/view/login/login';
import { Register } from './components/view/register/register';
import { CreateAccount } from './components/view/create-account/create-account';
import { accountSelectedGuard } from './guards/account-selected.guard';
import { guestGuard } from './guards/guest';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
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
  path: 'recent-demo',
  loadComponent: () =>
    import('./components/shared/recent-transactions/recent-transactions').then((m) => m.RecentTransactions),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/view/dashboard/dashboard').then(
      (m) => m.Dashboard
    ),
  },
  {
    path: 'account',
    loadComponent: () => import('./components/view/account/account').then(
      (m) => m.Account
    ),
    canActivate: [accountSelectedGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

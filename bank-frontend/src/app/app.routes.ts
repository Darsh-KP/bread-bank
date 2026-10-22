import { Routes } from '@angular/router';
import { Login } from './components/view/login/login';
import { Register } from './components/view/register/register';
import { CreateAccount } from './components/view/create-account/create-account';
import { accountSelectedGuard } from './guards/account-selected.guard';
import { guestGuard } from './guards/guest';
import {userAuthenticatedGuard} from './guards/user-authenticated-guard';

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
    canActivate: [userAuthenticatedGuard, accountSelectedGuard]
  },
  {
    path: 'profile-settings',
    loadComponent: () =>
      import('./components/view/profile_settings/profile-settings').then(
        (m) => m.ProfileSettings
      ),
    canActivate: [userAuthenticatedGuard]
  },
  {
    path: 'create-account',
    component: CreateAccount,
    canActivate: [userAuthenticatedGuard]
  },
  {
    path: 'transfer',
    loadComponent: () => import('./components/view/transfer/transfer').then(
      (m) => m.Transfer
    ),
    canActivate: [userAuthenticatedGuard]
  },
  {
    path: 'recent-demo',
    loadComponent: () =>
      import('./components/shared/recent-transactions/recent-transactions').then((m) => m.RecentTransactions),
    canActivate: [userAuthenticatedGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/view/dashboard/dashboard').then(
      (m) => m.Dashboard
    ),
    canActivate: [userAuthenticatedGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./components/view/account/account').then(
      (m) => m.Account
    ),
    canActivate: [userAuthenticatedGuard, accountSelectedGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

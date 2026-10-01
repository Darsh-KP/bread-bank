import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'history',
    loadComponent: () =>
      import('../components/view/transaction-history/transaction-history').then((m) => m.TransactionHistory),
  },
];
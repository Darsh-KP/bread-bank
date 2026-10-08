import {Component} from '@angular/core';
import {NavigationBar} from '../../shared/navigation-bar/navigation-bar';
import {TransactionButtonComponent} from '../../shared/money-transaction-modal/transaction-button';

@Component({
  imports: [
    NavigationBar,
    TransactionButtonComponent
  ],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {}

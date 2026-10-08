import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SingleTransactionType} from '../../../dtos/transaction/SingleTransactionType';
import {MoneyTransactionModal} from '../../shared/money-transaction-modal/money-transaction-modal';
import {NavigationBar} from '../../shared/navigation-bar/navigation-bar';

@Component({
  imports: [
    MatButton,
    NavigationBar
  ],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {
  private readonly modalService = inject(NgbModal);

  openTransaction(type: SingleTransactionType): void {
    const modalRef = this.modalService.open(
      MoneyTransactionModal,
      {
        centered: true,

        // Disable click-out
        backdrop: 'static',

        // Disable ESC
        keyboard: false,

        animation: true
      }
    );

    modalRef.componentInstance.transactionType.set(type);

    modalRef.result
      .then(result => {

        console.log('Transaction completed:', result);

        // Refresh account balance after transaction
      })
      .catch(reason => {

        console.log(
          'Transaction modal dismissed:',
          reason
        );
      });
  }
}

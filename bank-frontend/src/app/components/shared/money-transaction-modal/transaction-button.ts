import {Component, computed, inject, input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SingleTransactionType} from '../../../dtos/transaction/SingleTransactionType';
import {MoneyTransactionModal} from './money-transaction-modal';

@Component({
  selector: 'transaction-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      mat-stroked-button
      [color]="buttonColor()"
      type="button"
      (click)="onClick()">
      <mat-icon class="me-1">{{ buttonIcon() }}</mat-icon>
      {{ buttonText() }}
    </button>
  `
})
export class TransactionButtonComponent {
  private readonly modalService = inject(NgbModal);

  type = input.required<SingleTransactionType>();

  transactionSuccess = output<boolean>();

  buttonText = computed(() => this.type() === 'DEPOSIT' ? 'Deposit' : 'Withdraw');
  buttonIcon = computed(() => this.type() === 'DEPOSIT' ? 'attach_money' : 'money_off');
  buttonColor = computed(() => this.type() === 'DEPOSIT' ? 'primary' : 'accent');

  onClick(): void {
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

    modalRef.componentInstance.transactionType.set(this.type());

    modalRef.result
      .then(() => this.transactionSuccess.emit(true))
      .catch(() => this.transactionSuccess.emit(false));
  }
}

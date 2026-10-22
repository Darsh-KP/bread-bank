import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { SingleTransactionType } from '../../../dtos/transaction/SingleTransactionType';
import { TransactionPhase } from './TransactionPhase';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../services/transaction/transaction.service';
import { TransactionResponseDTO } from '../../../dtos/transaction/TransactionResponseDTO';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AMOUNT_REGEX, PIN_REGEX } from '../../../../utils/regExps';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [
    MatIcon,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
  ],
  selector: 'money-transaction-modal',
  styleUrl: './money-transaction-modal.css',
  templateUrl: './money-transaction-modal.html',
})
export class MoneyTransactionModal implements OnInit {
  // Inject required dependencies
  private readonly activeModal = inject(NgbActiveModal);
  private readonly transactionService = inject(TransactionService);

  // Ask the caller to provide required inputs
  transactionType = model.required<SingleTransactionType>();
  accountNumber = model.required<number>();

  // Set loading as the starting phase
  phase = signal<TransactionPhase>('loading');

  // String to store error messages
  errorMessage = signal<string>('');

  // State variable used to say if we are awaiting response
  isProcessing = signal<boolean>(false);

  // State variable used to track if response was successful or not
  isSuccess = signal<boolean>(false);

  // Variable to store transaction response
  transactionResult = signal<TransactionResponseDTO | null>(null);

  // PIN input form / field
  readonly pinForm = new FormGroup({
    pin: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(PIN_REGEX)],
    }),
  });

  // Amount input form/ field
  readonly amountForm = new FormGroup({
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(AMOUNT_REGEX), Validators.min(0.01)],
    }),
    description: new FormControl('', {
      validators: [Validators.maxLength(50)],
    }),
  });

  // Get the pin form control
  readonly pinControl = this.pinForm.controls.pin;

  // Get the amount form control
  readonly amountControl = this.amountForm.controls.amount;

  // Get the description form control
  readonly descriptionControl = this.amountForm.controls.description;

  // State variables for field validations
  isPinInvalid = signal<boolean>(false);
  isAmountInvalid = signal<boolean>(false);

  // Check if the PIN input is valid, only if it has been interacted with
  checkPinValidation(): void {
    this.isPinInvalid.set(
      this.pinControl.invalid && (this.pinControl.dirty || this.pinControl.touched),
    );
  }

  // Check if the amount input is valid, only if it has been interacted with
  checkAmountValidation(): void {
    this.isAmountInvalid.set(
      this.amountControl.invalid && (this.amountControl.dirty || this.amountControl.touched),
    );
  }

  // Render the default phase
  ngOnInit(): void {
    // Simulate loading, go to next phase
    setTimeout(() => {
      this.phase.set('pin');
    }, 1000);
  }

  // Handle PIN input events
  onPinInput(event: Event): void {
    // Get access to input element
    const input = event.target as HTMLInputElement;

    // Get the value from the field
    let value = input.value;

    // Numbers only, delete others
    value = value.replace(/\D/g, '');

    // Maximum 4 digits, ignore rest
    value = value.substring(0, 4);

    // Set the field with sanitized value
    this.pinControl.setValue(value);
  }

  // On submission, check if the PIN is valid for this account
  verifyPin(): void {
    // Mark the field as interacted with
    this.pinControl.markAsTouched();
    this.checkPinValidation();

    // Check if the pin is valid or if the transaction is already being processed
    if (this.pinForm.invalid || this.isProcessing()) {
      return;
    }

    // Start processing the PIN, set flags
    this.isProcessing.set(true);
    this.errorMessage.set('');

    // Attempt to verify PIN by calling the service
    this.transactionService
      .verifyPin({
        accountNumber: this.accountNumber(),
        pin: this.pinControl.value,
      })
      .subscribe({
        next: () => {
          // End the processing
          this.isProcessing.set(false);

          // The PIN is correct, go to next phase
          this.phase.set('amount');
        },

        // Handle errors from the service
        error: (error: unknown) => {
          // End the processing
          this.isProcessing.set(false);

          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 401:
                // Set incorrect PIN error message
                this.errorMessage.set('Incorrect PIN.');
                break;
              default:
                // Badly formed request or something went wrong in backend
                this.errorMessage.set('Something went wrong. Please try again later.');
            }

            // Reset the input field for PIN
            this.pinControl.reset();
            this.checkPinValidation();
          } else {
            // Client error
            this.errorMessage.set('Please check your internet connection.');
          }
        },
      });
  }

  // Handle amount input events
  onAmountInput(event: Event): void {
    // Get access to input element
    const input = event.target as HTMLInputElement;

    // Get the amount value
    let value = input.value;

    // Only allow digits and decimal point, delete others
    value = value.replace(/[^\d.]/g, '');

    // Find the decimal index
    const firstDecimalIndex = value.indexOf('.');

    // Only allow one decimal point
    if (firstDecimalIndex !== -1) {
      // Separate the values before and after decimal
      const beforeDecimal = value.substring(0, firstDecimalIndex);

      const afterDecimal = value.substring(firstDecimalIndex + 1).replace(/\./g, '');

      // Maximum two decimal places, ignore the rest
      value = beforeDecimal + '.' + afterDecimal.substring(0, 2);
    }

    // Remove leading zeros from input
    if (!value.startsWith('0.')) {
      value = value.replace(/^0+(?=\d)/, '');
    }

    // Set the field with sanitized value
    this.amountControl.setValue(value);
  }

  // On submission, process the transaction
  submitAmount(): void {
    // Mark the field as interacted with
    this.amountControl.markAsTouched();
    this.checkAmountValidation();

    // Check if the amount is valid or if the transaction is already being processed
    if (this.amountForm.invalid || this.isProcessing()) {
      return;
    }

    // Convert the amount into cents for preciseness
    const amountInCents = this.convertToCents(this.amountControl.value);

    // Check if no amount or negative amount is inputted
    if (amountInCents <= 0) {
      // Set the error message
      this.errorMessage.set('Amount must be greater than zero.');
      return;
    }

    // Get the description
    const description = this.descriptionControl.value?.trim() ?? null;

    // Start processing the transaction
    this.isProcessing.set(true);
    this.errorMessage.set('');

    // Get the PIN from the previous form
    const userPin = this.pinControl.value ?? '';

    // Create the payload for the reuqest
    const transactionPayload = {
      accountNumber: this.accountNumber(),
      pin: userPin,
      amountInCents,
      description: description,
    };

    // Select the correct method to call in the service
    const transactionRequest$ =
      this.transactionType() === 'DEPOSIT'
        ? this.transactionService.processDepositTransaction(transactionPayload)
        : this.transactionService.processWithdrawTransaction(transactionPayload);

    // Attempt to process the transaction by calling the service
    transactionRequest$.subscribe({
      next: (response) => {
        // Save the transaction response
        this.transactionResult.set(response);

        // End the processing
        this.isProcessing.set(false);

        // Set the transaction as successful
        this.isSuccess.set(true);

        // Go to next phase
        this.phase.set('result');
      },

      // Handle errors from the service
      error: (error: unknown) => {
        // End the processing
        this.isProcessing.set(false);

        // Set the transaction as failure
        this.isSuccess.set(false);

        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              // Set incorrect PIN error message
              this.errorMessage.set('Incorrect PIN.');
              break;
            case 422:
              // Set max balance will fail error message
              const message =
                this.transactionType() === 'DEPOSIT'
                  ? 'Deposit exceeds the maximum allowed account balance.'
                  : 'Insufficient balance.';
              this.errorMessage.set(message);

              // Switch to error phase
              this.transactionResult.set({
                amountInCents: amountInCents,
              });
              this.phase.set('result');
              break;
            default:
              // Badly formed request or something went wrong in backend
              this.errorMessage.set('Something went wrong. Please try again later.');
          }

          this.checkAmountValidation();
        } else {
          // Client error
          this.errorMessage.set('Please check your internet connection.');
        }
      },
    });
  }

  // Helper methods to convert amount input to cents for better precision
  private convertToCents(amount: string): number {
    // Split the numbers before and after decimal
    const [whole, decimal = ''] = amount.split('.');

    // Ensure that there are exactly 2 digits after decimal, fill with 0
    const paddedDecimal = decimal.padEnd(2, '0');

    // Return the amount in cents
    return Number(whole) * 100 + Number(paddedDecimal);
  }

  // When transaction is done and dismissed, close the modal
  finish(): void {
    // Close the modal, and return if it was successful
    this.activeModal.close(this.isSuccess());
  }

  // Close the modal, if the user clicks Cancel
  cancel(): void {
    // Check if a transaction is being processed
    if (this.isProcessing()) {
      return;
    }

    // Close the modal
    this.activeModal.dismiss('cancelled');
  }

  // Set the title based on the transaction type
  readonly title = computed(() => {
    return this.transactionType() === 'DEPOSIT' ? 'Deposit Money' : 'Withdraw Money';
  });

  // Set the button value based on the transaction type
  readonly actionText = computed(() => {
    return this.transactionType() === 'DEPOSIT' ? 'Deposit' : 'Withdraw';
  });

  // Set the result message based on the transaction type
  readonly successMessage = computed(() => {
    return this.transactionType() === 'DEPOSIT'
      ? 'Your deposit was successful.'
      : 'Your withdrawal was successful.';
  });

  // Helper method to convert amount input from cents to decimal
  readonly formattedAmount = computed(() => {
    // Get the transaction amount
    const result = this.transactionResult();
    const amount = result ? result.amountInCents : 0;

    // Format the amount from cents to decimal and return it
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  });
}

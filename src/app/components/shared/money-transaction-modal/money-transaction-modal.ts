import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AMOUNT_REGEX, PIN_REGEX } from '../../../../utils/regExps';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatIcon,
    MatButton,
    MatProgressSpinner,
  ],
  selector: 'money-transaction-modal',
  styleUrl: './money-transaction-modal.css',
  templateUrl: './money-transaction-modal.html',
})
export class MoneyTransactionModal {
  // String to store error messages
  errorMessage = signal<string>('');

  // State variable used to say if we are awaiting response
  isProcessing = signal<boolean>(false);

  // State variable used to track if response was successful or not
  isSuccess = signal<boolean>(false);

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
  });

  // Get the pin form control
  readonly pinControl = this.pinForm.controls.pin;

  // Get the amount form control
  readonly amountControl = this.amountForm.controls.amount;

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

    // TODO: Attempt to verify PIN by calling the service
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

    // Start processing the transaction
    this.isProcessing.set(true);
    this.errorMessage.set('');

    // Get the PIN from the previous form
    const userPin = this.pinControl.value ?? '';

    // TODO: Attempt to process the transaction by calling the service
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
}

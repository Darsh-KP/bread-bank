import { Component, ElementRef, ViewChild, inject, signal, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  passwordMatchValidator,
  passwordValidationRulesValidator,
  MIN_LENGTH
} from '../../../../utils/passwordValidation';

@Component({
  selector: 'password-change-modal', // 👈 Fixed: Updated from 'passwordModal'
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.css'
})
export class PasswordChangeModalComponent {
  private readonly formbuilder: FormBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') private dialogRef!: ElementRef<HTMLDialogElement>;

  /** Async callback provided by parent to execute password update */
  @Input() onSave?: (payload: { oldPassword: string; newPassword: string }) => Promise<void>;

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formbuilder.nonNullable.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, passwordValidationRulesValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  // Helper getters for the live rule checklist
  get newPasswordValue(): string {
    return this.form.controls.newPassword.value || '';
  }

  get isMinLengthValid(): boolean {
    return this.newPasswordValue.length >= MIN_LENGTH;
  }

  get hasDigitValid(): boolean {
    return /\d/.test(this.newPasswordValue);
  }

  get hasUppercaseValid(): boolean {
    return /[A-Z]/.test(this.newPasswordValue);
  }

  get hasLowercaseValid(): boolean {
    return /[a-z]/.test(this.newPasswordValue);
  }

  // change-password-modal.component.ts

  showModal(): void {
    this.form.reset();
    this.errorMessage.set('');
    this.dialogRef.nativeElement.showModal();
  }

  close(): void {
    this.dialogRef.nativeElement.close();
  }

  /** Cleanup happens safely after dialog unmounts */
  onDialogClose(): void {
    this.form.reset();
    this.errorMessage.set('');
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const payload = this.form.getRawValue();

      if (this.onSave) {
        await this.onSave(payload);
      }

      this.close();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update password. Please try again.';
      this.errorMessage.set(msg);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

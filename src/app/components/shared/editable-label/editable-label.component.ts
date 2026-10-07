import { Component, ChangeDetectorRef, inject, input, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { validate, emailPattern, phonePattern } from '../../../../utils/regExps';

@Component({
  selector: 'editable-label',
  imports: [FormsModule],
  standalone: true,
  templateUrl: 'editable-label.html',
  styleUrl: 'editable-label.css',
})
export class EditableLabelComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  label = input<string>('');
  type = input<'text' | 'email' | 'tel'>('text');
  pattern = input<RegExp>();
  errorMessage = input<string>('');
  onSave = input<(newValue: string) => Promise<void>>();

  // Model bound to input state
  value = model<string>('');

  isReadOnly: boolean = true;
  isSaving: boolean = false;
  displayToast: boolean = false;
  toastMessage: string = '';

  private originalValue: string = '';
  private toastTimeout?: ReturnType<typeof setTimeout>;

  // Display value formats phone numbers in read-only mode
  displayValue = computed(() => {
    const rawVal = this.value();
    if (this.type() === 'tel' && this.isReadOnly && rawVal) {
      return this.formatPhoneNumber(rawVal);
    }
    return rawVal ?? '';
  });

  onInputChange(val: string): void {
    // Preserve raw input string during typing
    this.value.set(val);
  }

  // Format 10 digits as (XXX) XXX - XXXX
  private formatPhoneNumber(phone: string): string {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]} - ${match[3]}` : phone;
  }

  /**
   * Toggles between edit and read-only modes.
   */
  async toggleEdit(): Promise<void> {
    if (!this.isReadOnly) {
      const currentValue = (this.value() ?? '').trim();
      const previousValue = (this.originalValue ?? '').trim();

      // 1. Emptiness Check
      if (currentValue === '') {
        this.displayToastError('This field cannot be left blank');
        return;
      }

      // 2. Unchanged Check
      if (currentValue === previousValue) {
        this.isReadOnly = true;
        this.dismissToastError();
        return;
      }

      // 3. Resolve active pattern explicitly
      let activePattern = this.pattern();
      if (!activePattern) {
        if (this.type() === 'email') {
          activePattern = emailPattern;
        } else if (this.type() === 'tel') {
          activePattern = phonePattern;
        }
      }

      // 4. Format Validation Check
      if (activePattern && !validate(currentValue, activePattern)) {
        this.displayToastError(this.errorMessage() || 'Invalid input format');
        return;
      }

      // 5. Clean phone digits ONLY AFTER passing regex validation
      const finalSaveValue = this.type() === 'tel' ? currentValue.replace(/\D/g, '') : currentValue;

      // 6. Asynchronous Save Execution
      const saveCallback = this.onSave();
      if (saveCallback) {
        this.isSaving = true;
        this.dismissToastError();
        this.cdr.markForCheck();

        try {
          await saveCallback(finalSaveValue);
          this.value.set(finalSaveValue);
          this.originalValue = finalSaveValue;
          this.isReadOnly = true;
        } catch (err: unknown) {
          const reason = err instanceof Error ? err.message : 'Failed to save value.';
          this.displayToastError(reason);
          this.isReadOnly = false;
        } finally {
          this.isSaving = false;
          this.cdr.markForCheck();
        }
      } else {
        this.value.set(finalSaveValue);
        this.isReadOnly = true;
      }

      return;
    }

    // Entering Edit Mode: Snapshot starting value here ONLY
    this.originalValue = this.value() ?? '';
    this.isReadOnly = false;
    this.dismissToastError();
  }

  /**
   * Reverts changes and exits edit mode when ESC is pressed or edit is canceled.
   */
  cancelEdit(): void {
    if (this.isReadOnly) return;
    this.value.set(this.originalValue);
    this.isReadOnly = true;
    this.dismissToastError();
  }

  displayToastError(msg?: string): void {
    this.toastMessage = msg || this.errorMessage() || 'Invalid input format';
    this.displayToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.displayToast = false;
      this.cdr.markForCheck();
    }, 3000);

    this.cdr.markForCheck();
  }

  dismissToastError(): void {
    this.displayToast = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.cdr.markForCheck();
  }
}

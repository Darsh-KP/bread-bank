import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, inject, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { validate } from '../../../../utils/regExps';

@Component({
  selector: 'editable-label',
  imports: [FormsModule],
  standalone: true,
  templateUrl: 'editable-label.html',
})
export class EditableLabelComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() label: string = '';
  @Input() value: string = '';
  @Input() type: 'text' | 'email' | 'tel' = 'text';
  @Input() pattern?: RegExp;
  @Input() errorMessage: string = '';

  @Input() onSave?: (newValue: string) => Promise<void>;

  isReadOnly: boolean = true;
  isSaving: boolean = false;
  displayToast: boolean = false;
  toastMessage: string = '';

  private originalValue: string = '';
  private toastTimeout?: ReturnType<typeof setTimeout>;

  //Check if user changes the value of the text field
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.originalValue = changes['value'].currentValue ?? '';
    }
  }

  /**
   * Toggles between edit and read-only modes.
   *
   * - When entering edit mode: Captures a snapshot of the starting value and clears errors.
   * - When saving: Validates formatting, skips redundant network calls if unchanged,
   *   executes the asynchronous `onSave` callback, and manages loading/error UI states.
   */
  async toggleEdit(): Promise<void> {
    // ==========================================
    // BRANCH 1: User clicked "SAVE" (Currently Editing)
    // ==========================================
    if (!this.isReadOnly) {
      const currentValue = (this.value ?? '').trim();
      const previousValue = (this.originalValue ?? '').trim();

      // 1. Unchanged Check:
      // Exit edit mode cleanly without calling the API if the user made no actual edits.
      if (currentValue === previousValue) {
        this.isReadOnly = true;
        this.dismissToastError();
        return;
      }

      // 2. Format Validation Check:
      // Run regex/format checks. If invalid, keep the field open and display error toast.
      if (!validate(this.value, this.pattern)) {
        this.displayToastError(this.errorMessage || 'Invalid input format');
        return;
      }

      // 3. Asynchronous Save Execution:
      if (this.onSave) {
        // Set loading state and notify Angular to immediately render "Saving..." button text.
        this.isSaving = true;
        this.dismissToastError();
        this.cdr.markForCheck();

        try {
          // Await the parent's save operation (e.g., HTTP backend call or uniqueness check).
          await this.onSave(currentValue);

          // Success: Update local baseline snapshot and lock input back to read-only.
          this.originalValue = currentValue;
          this.isReadOnly = true;
        } catch (err: unknown) {
          // Failure (e.g., duplicate email/phone or network timeout):
          // Extract error message, present toast banner, and keep field open for user correction.
          const reason = err instanceof Error ? err.message : 'Failed to save value.';
          this.displayToastError(reason);
          this.isReadOnly = false;
        } finally {
          // Guaranteed Cleanup:
          // Always reset saving status and trigger change detection to restore button label ("Save" / "Edit").
          this.isSaving = false;
          this.cdr.markForCheck();
        }
      } else {
        // Fallback if no `onSave` callback was provided by parent component.
        this.isReadOnly = true;
      }

      return;
    }

    // ==========================================
    // BRANCH 2: User clicked "EDIT" (Currently Read-Only)
    // ==========================================
    // Capture initial baseline value before edits occur, unlock input, and dismiss stale toasts.
    this.originalValue = this.value ?? '';
    this.isReadOnly = false;
    this.dismissToastError();
  }

  //Used to display error message if phone/email are not properly formatted
  //or if email/phone number is taken.
  displayToastError(msg?: string): void {
    this.toastMessage = msg || this.errorMessage || 'Invalid input format';
    this.displayToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.displayToast = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  //Dismisses error message if user continues typing or presses close button
  dismissToastError(): void {
    this.displayToast = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.cdr.markForCheck();
  }
}

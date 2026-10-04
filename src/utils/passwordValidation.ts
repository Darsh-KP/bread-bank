import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Custom validator to check if new password and confirmation match */
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

/**
 * Custom Validator adapter for validatePassword
 */
export const passwordValidationRulesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value ?? '';

  if (!value) {
    return null; // Leave empty field checks to Validators.required
  }

  const errors = validatePassword(value);

  return errors.length > 0 ? { passwordRules: errors } : null;
};

export const MIN_LENGTH = 8;

export function validatePassword(password: String): string[] {
    const errors: string[] = [];

    if (password.length < MIN_LENGTH) {
        errors.push("Password must be at least 8 characters long.");
    }

    let digit = false;
    let lower = false;
    let upper = false;
    for (const ch of password) {
        if (ch >= '0' && ch <= '9') {
            digit = true;
        } else if (ch >= 'a' && ch <= 'z') {
            lower = true;
        } else if (ch >= 'A' && ch <= 'Z') {
            upper = true;
        }
    }

    if (!digit) {
        errors.push("Password must include at least 1 digit");
    }
    if (!lower) {
        errors.push("Password must include at least 1 lowercase character");
    }
    if (!upper) {
        errors.push("Password must include at least 1 uppercase character");
    }

    return errors;
}

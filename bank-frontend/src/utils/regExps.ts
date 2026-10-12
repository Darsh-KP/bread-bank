// Match standard email formats: name@domain.tld
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Match phone numbers with 10–14 digits, allowing optional +, spaces, hyphens, and parentheses
export const phonePattern = /^\+?[\s(]*(?:[0-9][\s\-\(\)]*){10,14}$/;

// A PIN is a four-digit number where preceding zeroes are significant
export const pinPattern = /^\d{4}$/;

// Validates input to make sure string matches email or phone format
export function validate(value: string, pattern?: RegExp): boolean {
  const val = (value ?? '').trim();
  if (!val) return false;
  if (!pattern) return true; // If pattern is omitted, basic non-empty string is valid

  return pattern.test(val);
}

// PIN pattern: must be 4 digits
export const PIN_REGEX = /^\d{4}$/;

// Amount pattern: max 2 decimal numbers
export const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

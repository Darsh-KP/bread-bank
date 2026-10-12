export function normalizePhone(phone: string): string {
  //Regular expression targets non digit characters and replaces them with blank space
  const digitsOnly = phone.replace(/\D/g, '');

  //If it's an 11-digit number starting with '1', strip the '1'
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return digitsOnly.slice(1);
  }

  return digitsOnly;
}

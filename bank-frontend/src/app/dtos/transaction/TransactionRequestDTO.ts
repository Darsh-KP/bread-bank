export interface TransactionRequestDTO {
  accountNumber: number;
  pin: string;
  amountInCents: number;
  description: string | null;
}

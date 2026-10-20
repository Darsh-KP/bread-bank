export interface TransactionRequestDTO {
  accountNumber: number;
  pin: string;
  amountInCents: bigint;
}

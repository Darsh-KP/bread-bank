import {SingleTransactionType} from './SingleTransactionType';

export interface TransactionRequestDTO {
  type: SingleTransactionType;
  pin: string;
  amountInCents: number;
}

import {SingleTransactionType} from './SingleTransactionType';

export interface TransactionResponseDTO {
  success: boolean;
  transactionType: SingleTransactionType;
  amountInCents: number;
}

import { TransactionHistoryType } from './TransactionHistoryType';

export interface TransactionHistoryItemDto {
  id: string;
  type: TransactionHistoryType;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}
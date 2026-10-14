import { AccountSummary } from './AccountSummary';

export interface AllAccountsResponseDto {
  // might not need this
  success: boolean;
  accounts: AccountSummary[];
}

export interface AccountSummary {
  accountId: number;
  accountTypeName: string;
  nickname: string | null;
  lastFour: string;
  balanceInCents: number;
}

export interface Account {
    id: string;
    type: string;
    nickname: string; // user-defined
    balance: number;
    opened: string;
    frozen: boolean;
    owners: String[]; // List of names
}

export interface AccountResponse {
    accounts: Account[];
}
import { Component, computed, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import type { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';

import { Transaction, TransactionService, TransactionType, isMoneyOut } from '../../../services/transaction';
ModuleRegistry.registerModules([AllCommunityModule]); // turns on the grid features

/** A transaction plus a signed amount (negative = money out) so the grid can sort and filter on it. */
interface Row extends Transaction {
  signedAmount: number;
}

const TYPE_LABEL: Record<TransactionType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdrawal',
  TRANSFER_IN: 'Transfer in',
  TRANSFER_OUT: 'Transfer out',
};

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

// The date filter compares whole days, so strip the time from the cell value.
const dateFilterParams = {
  comparator: (filterDate: Date, cellValue: Date) => {
    const day = new Date(cellValue.getFullYear(), cellValue.getMonth(), cellValue.getDate());
    return day < filterDate ? -1 : day > filterDate ? 1 : 0;
  },
};

const typeBadge = (p: ICellRendererParams<Row>) => {
  if (!p.data) return '';
  const out = isMoneyOut(p.data.type);
  return (
    `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:500;` +
    `background:${out ? '#fdeaea' : '#e6f3e7'};color:${out ? '#9b2c2c' : '#1f6b2c'}">` +
    `${TYPE_LABEL[p.data.type]}</span>`
  );
};
// this file is supposed to display the transaction history for the user
@Component({ // this decorator defines the metadata for the TransactionHistory component
  selector: 'app-transaction-history',
  imports: [AgGridAngular], // the AgGridAngular component used for displaying the transaction grid
  templateUrl: './transaction-history.html', // the HTML template for the component
  styleUrl: './transaction-history.css', // the CSS styles for the component
})
export class TransactionHistory {
  private readonly service = inject(TransactionService);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() { // initializes the component and loads the transactions
    this.service
      .getTransactions()
      .then((list) => this.transactions.set(list))
      .catch(() => this.error.set("We couldn't load your transactions. Please try again."))
      .finally(() => this.loading.set(false));
  }
    readonly rows = computed<Row[]>(() =>
    this.transactions().map((t) => ({ ...t, signedAmount: isMoneyOut(t.type) ? -t.amount : t.amount })),
  );

  readonly columnDefs: ColDef<Row>[] = [
    {
      colId: 'date',
      headerName: 'Date',
      valueGetter: (p) => new Date(p.data!.createdAt),
      valueFormatter: (p: ValueFormatterParams<Row, Date>) => dateTime.format(p.value!),
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams,
      sort: 'desc',
      minWidth: 180,
    },
    { field: 'description', headerName: 'Description', filter: 'agTextColumnFilter', flex: 2 },
    {
      colId: 'type',
      headerName: 'Type',
      valueGetter: (p) => TYPE_LABEL[p.data!.type],
      cellRenderer: typeBadge,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'signedAmount',
      headerName: 'Amount',
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      valueFormatter: (p: ValueFormatterParams<Row, number>) => usd.format(p.value ?? 0),
      cellStyle: (p) => ({ color: (p.value ?? 0) < 0 ? '#c0392b' : '#2e7d32', fontWeight: '600' }),
    },
    {
      field: 'balanceAfter',
      headerName: 'Balance',
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      valueFormatter: (p: ValueFormatterParams<Row, number>) => usd.format(p.value ?? 0),
    },
  ];

  readonly defaultColDef: ColDef<Row> = { sortable: true, resizable: true, flex: 1, minWidth: 110 };

  readonly theme = themeQuartz.withParams({
    fontFamily: 'inherit',
    headerBackgroundColor: '#f8ddb3',
    accentColor: '#9a5833',
    borderColor: '#d4cbc5',
    wrapperBorderRadius: 12,
  });
  

// returns the signed amount for a transaction: negative for money out, positive for money in

}

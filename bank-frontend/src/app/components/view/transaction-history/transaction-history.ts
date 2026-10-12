import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import type { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';

import { Transaction, TransactionService, TransactionType, isMoneyOut } from '../../../services/transaction_history';

// Register the AG Grid features once. Later this can be narrowed to only the modules we use.
ModuleRegistry.registerModules([AllCommunityModule]);

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
const dateShort = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

// Below this width the grid switches to a smaller set of columns (see NARROW_COLUMNS).
const NARROW_QUERY = '(max-width: 720px)';

// Cell renderers return HTML strings, so escape any text that came from data.
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const GREEN = '#2e7d32';
const RED = '#c0392b';

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
    `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:500;line-height:1.6;white-space:nowrap;` +
    `background:${out ? '#fdeaea' : '#e6f3e7'};color:${out ? '#9b2c2c' : '#1f6b2c'}">` +
    `${TYPE_LABEL[p.data.type]}</span>`
  );
};

// Phone-sized screens show fewer columns: the type moves under the description, and the balance is hidden.
const descriptionWithType = (p: ICellRendererParams<Row>) => {
  const row = p.data;
  if (!row) return '';
  return (
    `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;line-height:1.35">` +
    `<div style="font-weight:500;overflow:hidden;text-overflow:ellipsis">${esc(row.description ?? TYPE_LABEL[row.type])}</div>` +
    `<div style="font-size:12px;opacity:.7">${TYPE_LABEL[row.type]}</div></div>`
  );
};

const amountColumn: ColDef<Row> = {
  field: 'signedAmount',
  headerName: 'Amount',
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  valueFormatter: (p: ValueFormatterParams<Row, number>) => usd.format(p.value ?? 0),
  cellStyle: (p) => ({ color: (p.value ?? 0) < 0 ? RED : GREEN, fontWeight: '600' }),
};

const WIDE_COLUMNS: ColDef<Row>[] = [
  {
    colId: 'date',
    headerName: 'Date',
    valueGetter: (p) => new Date(p.data!.createdAt),
    valueFormatter: (p: ValueFormatterParams<Row, Date>) => dateTime.format(p.value!),
    filter: 'agDateColumnFilter',
    filterParams: dateFilterParams,
    sort: 'desc',
    minWidth: 200,
  },
  { field: 'description', headerName: 'Description', filter: 'agTextColumnFilter', flex: 2, minWidth: 130 },
  {
    colId: 'type',
    headerName: 'Type',
    valueGetter: (p) => TYPE_LABEL[p.data!.type],
    cellRenderer: typeBadge,
    filter: 'agTextColumnFilter',
    minWidth: 140,
  },
  { ...amountColumn, minWidth: 120 },
  {
    field: 'balanceAfter',
    headerName: 'Balance',
    type: 'rightAligned',
    filter: 'agNumberColumnFilter',
    valueFormatter: (p: ValueFormatterParams<Row, number>) => usd.format(p.value ?? 0),
    minWidth: 120,
  },
];

const NARROW_COLUMNS: ColDef<Row>[] = [
  {
    colId: 'date',
    headerName: 'Date',
    valueGetter: (p) => new Date(p.data!.createdAt),
    valueFormatter: (p: ValueFormatterParams<Row, Date>) => dateShort.format(p.value!),
    filter: 'agDateColumnFilter',
    filterParams: dateFilterParams,
    sort: 'desc',
    flex: 0,
    width: 96,
    minWidth: 90,
  },
  {
    field: 'description',
    headerName: 'Description',
    filter: 'agTextColumnFilter',
    cellRenderer: descriptionWithType,
    flex: 1,
    minWidth: 80,
  },
  { ...amountColumn, flex: 0, width: 100, minWidth: 90 },
];

@Component({
  selector: 'app-transaction-history',
  imports: [AgGridAngular, NavigationBar],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css',
})
export class TransactionHistory {
  private readonly service = inject(TransactionService);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  /** What the grid displays. */
  readonly rows = computed<Row[]>(() =>
    this.transactions().map((t) => ({ ...t, signedAmount: isMoneyOut(t.type) ? -t.amount : t.amount })),
  );

  /** True on phone-sized screens. Updates live when the window is resized or the phone is rotated. */
  readonly narrow = signal(false);

  readonly columnDefs = computed<ColDef<Row>[]>(() => (this.narrow() ? NARROW_COLUMNS : WIDE_COLUMNS));

  readonly defaultColDef = computed<ColDef<Row>>(() => ({
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 110,
    // The header filter icon takes too much room on a phone.
    suppressHeaderFilterButton: this.narrow(),
  }));

  readonly rowHeight = computed(() => (this.narrow() ? 56 : undefined));
  readonly pageSizes = computed(() => (this.narrow() ? false : [5, 10, 25]));

  // Colors follow the team palette (BANK-43). Switch these to the shared CSS variables once that is merged.
  readonly theme = themeQuartz.withParams({
    fontFamily: 'inherit',
    backgroundColor: '#fffefc',
    foregroundColor: '#401507',
    headerBackgroundColor: '#f8ddb3',
    headerTextColor: '#401507',
    accentColor: '#9a5833',
    borderColor: '#d4cbc5',
    rowHoverColor: '#f7f3eb',
    wrapperBorderRadius: 12,
  });

  constructor() {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const query = window.matchMedia(NARROW_QUERY);
      const onChange = (e: MediaQueryListEvent) => this.narrow.set(e.matches);
      this.narrow.set(query.matches);
      query.addEventListener('change', onChange);
      inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
    }

    this.service
      .getTransactions()
      .then((list) => this.transactions.set(list))
      .catch(() => this.error.set("We couldn't load your transactions. Please try again."))
      .finally(() => this.loading.set(false));
  }
}

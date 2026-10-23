  import { Component, OnInit, signal, computed } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { pinPattern } from '../../../../utils/regExps';
  import {NavigationBar} from '../../shared/navigation-bar/navigation-bar'
  import { Router } from '@angular/router';
  import { firstValueFrom } from 'rxjs';

  type Dialog = 'none' | 'prompt' | 'congratulate';
  type Account = { marketingName: string; annualYieldRate: number; maturationDays: number };
  type Approval = {accountNumber: number};

  @Component({
    imports: [ NavigationBar ],
    selector: 'app-create-account',
    styleUrl: './create-account.css',
    templateUrl: './create-account.html',
  })
  export class CreateAccount implements OnInit {
    readonly products = signal<Account[]>([]);
    readonly selected = signal<string | null>(null);
    readonly dialog = signal<Dialog>('none');
    readonly waiting = signal(false);
    readonly error = signal<string | null>(null);

    readonly certificateDeposits = computed(() =>
      this.products().filter(a => a.marketingName.endsWith('CD')));

    readonly accounts = computed(() =>
      this.products().filter(a => !a.marketingName.endsWith('CD')));

    constructor(private http: HttpClient, private router: Router) {}

    async ngOnInit() {
      try {
        const products = await firstValueFrom(this.http.get<Account[]>('http://localhost:8080/account-types'));
        this.products.set(products);
      } catch {
        this.error.set('Could not fetch BFS\' products.');
      }
    }

    selectProduct(name: string) {
      this.selected.set(name);
    }

    clearSelection() {
      this.selected.set(null);
    }

    closeDialog() {
      this.dialog.set('none');
    }

    continueCreation() {
      if(this.selected() !== null)  {
        this.error.set(null);
        this.dialog.set('prompt');
      }
    }

    goToDashboard() {
      this.router.navigate(['/dashboard']);
    }

    async newAccount(pin: string, nickname: string) {
      const accountType = this.selected();

      if(this.waiting() || accountType == null) return;

      if(!pinPattern.test(pin)) {
        this.error.set('A four-digit numerical pin is required.');
        return;
      }

      this.error.set(null);
      this.waiting.set(true);

      try {
        const response = await firstValueFrom(this.http.post<Approval>
          ('http://localhost:8080/create-account',
          {accountType: this.selected(), nickname, pin}));

        if(!response || typeof response.accountNumber !== 'number')
          throw new Error('Invalid server response');

        this.dialog.set('congratulate');
      } catch {
        this.error.set('Account creation failed.');
      } finally {
        this.waiting.set(false);
      }
  }
}

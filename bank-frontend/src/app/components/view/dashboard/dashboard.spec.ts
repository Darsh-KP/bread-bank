import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { DashboardAccountsService } from '../../../services/dashboard-accounts/dashboard-accounts';
import { AccountSummary } from '../../shared/dashboard-card/dashboard-card';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  const accounts: AccountSummary[] = [
    { id: 1, accountType: 'Everyday Checking', lastFour: '4821', balance: 2845.76 },
    { id: 2, accountType: 'High-Yield Savings', lastFour: '9073', balance: 12750.4 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { currentUser: { userName: 'itsYaBreadBoi', firstName: 'Iakkhos' } },
        },
        {
          provide: DashboardAccountsService,
          useValue: { getAccountsForUser: () => Promise.resolve(accounts) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each account associated with the user', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-dashboard-card').length).toBe(2);
    expect(compiled.textContent).toContain('Welcome back, Iakkhos');
    expect(compiled.textContent).toContain('$15,596.16');
  });
});

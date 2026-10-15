import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { DashboardAccountsService } from '../../../services/dashboard-accounts/dashboard-accounts';
import { NavigationBar } from './navigation-bar';

describe('NavigationBar', () => {
  let component: NavigationBar;
  let fixture: ComponentFixture<NavigationBar>;
  const accounts = [
    { id: 1, accountType: 'Everyday Checking', lastFour: '4821', balance: 2845.76 },
    { id: 2, accountType: 'High-Yield Savings', lastFour: '9073', balance: 12750.4 },
  ];
  const getAccountsForUser = vi.fn().mockResolvedValue(accounts);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBar],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { currentUser: { username: 'itsYaBreadBoi' } },
        },
        {
          provide: DashboardAccountsService,
          useValue: { getAccountsForUser },
        },
      ],
    }).compileComponents();

    getAccountsForUser.mockClear();
    fixture = TestBed.createComponent(NavigationBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the mobile navigation toggle state accessibly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.mobile-menu-toggle');

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('.nav-links')?.classList).toContain('mobile-open');
  });

  it('loads and displays the signed-in user accounts when the menu opens', async () => {
    await component.loadAccountItems();
    fixture.detectChanges();

    expect(getAccountsForUser).toHaveBeenCalledWith({ username: 'itsYaBreadBoi' });
    expect(component.accountItems()).toEqual(accounts);

    const menuButton = fixture.nativeElement.querySelector<HTMLButtonElement>(
      '[aria-label="Accounts"]',
    );
    menuButton?.click();
    fixture.detectChanges();

    expect(document.body.textContent).toContain('Everyday Checking');
    expect(document.body.textContent).toContain('4821');
    expect(document.body.textContent).toContain('High-Yield Savings');
    expect(getAccountsForUser).toHaveBeenCalledTimes(1);
  });
});

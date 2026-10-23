import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardCard } from './dashboard-card';

describe('DashboardCard', () => {
  let component: DashboardCard;
  let fixture: ComponentFixture<DashboardCard>;

  // TODO: refactor these tests, if time allows
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCard);
    fixture.componentRef.setInput('account', {
      id: 1,
      accountType: 'Everyday Checking',
      lastFour: '4821',
      balance: 2845.76,
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

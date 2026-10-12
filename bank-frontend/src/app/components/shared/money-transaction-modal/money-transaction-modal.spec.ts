import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoneyTransactionModal } from './money-transaction-modal';

describe('MoneyTransactionModal', () => {
  let component: MoneyTransactionModal;
  let fixture: ComponentFixture<MoneyTransactionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyTransactionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MoneyTransactionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

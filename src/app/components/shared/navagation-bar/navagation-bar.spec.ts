import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavagationBar } from './navagation-bar';

describe('NavagationBar', () => {
  let component: NavagationBar;
  let fixture: ComponentFixture<NavagationBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavagationBar],
    }).compileComponents();

    fixture = TestBed.createComponent(NavagationBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

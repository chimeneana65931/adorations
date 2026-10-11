import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Adorations } from './adorations';

describe('Adorations', () => {
  let component: Adorations;
  let fixture: ComponentFixture<Adorations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adorations],
    }).compileComponents();

    fixture = TestBed.createComponent(Adorations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

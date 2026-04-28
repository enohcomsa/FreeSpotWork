import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventRegistrationUi } from './freespot-event-registration-ui';

describe('FreespotEventRegistrationUi', () => {
  let component: FreespotEventRegistrationUi;
  let fixture: ComponentFixture<FreespotEventRegistrationUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventRegistrationUi],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventRegistrationUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

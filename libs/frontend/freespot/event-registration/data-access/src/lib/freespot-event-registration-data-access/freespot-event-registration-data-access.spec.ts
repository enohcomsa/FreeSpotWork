import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventRegistrationDataAccess } from './freespot-event-registration-data-access';

describe('FreespotEventRegistrationDataAccess', () => {
  let component: FreespotEventRegistrationDataAccess;
  let fixture: ComponentFixture<FreespotEventRegistrationDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventRegistrationDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventRegistrationDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

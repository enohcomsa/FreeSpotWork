import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventRegistrationFeature } from './freespot-event-registration-feature';

describe('FreespotEventRegistrationFeature', () => {
  let component: FreespotEventRegistrationFeature;
  let fixture: ComponentFixture<FreespotEventRegistrationFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventRegistrationFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventRegistrationFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

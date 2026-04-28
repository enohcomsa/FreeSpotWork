import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotUserSetupFeature } from './freespot-user-setup-feature';

describe('FreespotUserSetupFeature', () => {
  let component: FreespotUserSetupFeature;
  let fixture: ComponentFixture<FreespotUserSetupFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotUserSetupFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotUserSetupFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

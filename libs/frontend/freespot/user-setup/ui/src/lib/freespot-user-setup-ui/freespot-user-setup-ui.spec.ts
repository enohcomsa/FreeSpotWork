import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotUserSetupUi } from './freespot-user-setup-ui';

describe('FreespotUserSetupUi', () => {
  let component: FreespotUserSetupUi;
  let fixture: ComponentFixture<FreespotUserSetupUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotUserSetupUi],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotUserSetupUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

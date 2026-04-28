import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotUniversityMapUi } from './freespot-university-map-ui';

describe('FreespotUniversityMapUi', () => {
  let component: FreespotUniversityMapUi;
  let fixture: ComponentFixture<FreespotUniversityMapUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotUniversityMapUi],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotUniversityMapUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

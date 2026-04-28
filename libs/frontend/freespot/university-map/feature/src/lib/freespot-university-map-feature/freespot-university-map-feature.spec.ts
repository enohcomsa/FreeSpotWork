import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotUniversityMapFeature } from './freespot-university-map-feature';

describe('FreespotUniversityMapFeature', () => {
  let component: FreespotUniversityMapFeature;
  let fixture: ComponentFixture<FreespotUniversityMapFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotUniversityMapFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotUniversityMapFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

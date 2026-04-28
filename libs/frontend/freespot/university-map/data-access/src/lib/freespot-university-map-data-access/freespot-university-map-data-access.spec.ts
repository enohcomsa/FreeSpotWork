import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotUniversityMapDataAccess } from './freespot-university-map-data-access';

describe('FreespotUniversityMapDataAccess', () => {
  let component: FreespotUniversityMapDataAccess;
  let fixture: ComponentFixture<FreespotUniversityMapDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotUniversityMapDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotUniversityMapDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

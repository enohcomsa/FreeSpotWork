import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventsCatalogDataAccess } from './freespot-events-catalog-data-access';

describe('FreespotEventsCatalogDataAccess', () => {
  let component: FreespotEventsCatalogDataAccess;
  let fixture: ComponentFixture<FreespotEventsCatalogDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventsCatalogDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventsCatalogDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

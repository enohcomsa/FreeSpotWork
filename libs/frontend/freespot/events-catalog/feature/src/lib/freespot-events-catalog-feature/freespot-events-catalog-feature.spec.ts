import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventsCatalogFeature } from './freespot-events-catalog-feature';

describe('FreespotEventsCatalogFeature', () => {
  let component: FreespotEventsCatalogFeature;
  let fixture: ComponentFixture<FreespotEventsCatalogFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventsCatalogFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventsCatalogFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

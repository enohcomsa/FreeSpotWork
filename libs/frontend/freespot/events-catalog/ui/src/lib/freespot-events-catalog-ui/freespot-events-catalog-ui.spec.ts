import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreespotEventsCatalogUi } from './freespot-events-catalog-ui';

describe('FreespotEventsCatalogUi', () => {
  let component: FreespotEventsCatalogUi;
  let fixture: ComponentFixture<FreespotEventsCatalogUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreespotEventsCatalogUi],
    }).compileComponents();

    fixture = TestBed.createComponent(FreespotEventsCatalogUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

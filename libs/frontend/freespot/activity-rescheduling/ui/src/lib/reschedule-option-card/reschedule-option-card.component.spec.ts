import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { RescheduleOptionCardComponent } from './reschedule-option-card.component';
import { RescheduleOptionCardVm } from './activity-rescheduling.vm';

describe('RescheduleOptionCardComponent', () => {
  let fixture: ComponentFixture<RescheduleOptionCardComponent>;
  let component: RescheduleOptionCardComponent;

  const vm: RescheduleOptionCardVm = {
    id: 'activity-1',
    subjectName: 'Math',
    buildingName: 'Building 1',
    floorName: 'Floor 1',
    roomName: 'Room 1',
    date: '2012-01-01',
    startHour: 10,
    endHour: 12,
    freeSpots: 20,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RescheduleOptionCardComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RescheduleOptionCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('vm', vm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render subject name', () => {
    const element: HTMLParagraphElement = fixture.nativeElement.querySelector(
      '[data-automation-id="subject-name"]'
    );

    expect(element.textContent?.trim()).toBe('Math');
  });

  it('should render booking date and hour range', () => {
    const element: HTMLParagraphElement = fixture.nativeElement.querySelector(
      '[data-automation-id="booking-date"]'
    );

    expect(element.textContent).toContain('Sunday, 01 Jan, 2012');
    expect(element.textContent).toContain('10-12');
  });

  it('should render booking location', () => {
    const element: HTMLParagraphElement = fixture.nativeElement.querySelector(
      '[data-automation-id="booking-location"]'
    );

    expect(element.textContent).toContain('Building 1');
    expect(element.textContent).toContain('Floor 1');
    expect(element.textContent).toContain('Room 1');
  });

  it('should render free spots', () => {
    const element: HTMLDivElement = fixture.nativeElement.querySelector(
      '[data-automation-id="number-free-spots"]'
    );

    expect(element.textContent).toContain('20');
    expect(element.textContent).toContain('BOOKING_SEARCH_RESULT.FREE_SPOTS');
  });

  it('should render book button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-automation-id="book-button"]'
    );

    expect(button.textContent).toContain('DYNAMIC_FORM.BOOK');
  });

  it('should emit activity id when book button is clicked', () => {
    let emittedId: string | undefined;

    component.book.subscribe((id) => {
      emittedId = id;
    });

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-automation-id="book-button"]'
    );

    button.click();

    expect(emittedId).toBe('activity-1');
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ActivityBookingCardComponent } from "./activity-booking-card.component";
import { ActivityBookingCardVm } from './activity-booking.vm';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from "@ngx-translate/core";


describe('ActivityBookingCardComponent', () => {
  let component: ActivityBookingCardComponent;
  let fixture: ComponentFixture<ActivityBookingCardComponent>;


  const vm: ActivityBookingCardVm = {
    id: '1',
    activityType: 'LABORATORY',
    subjectName: 'math',
    buildingName: 'build1',
    floorName: 'floor1',
    roomName: 'room1',
    date: '01-01-2012',
    startHour: 10,
    endHour: 12,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityBookingCardComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityBookingCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('vm', vm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render activity type', () => {
    const element = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="activity-type"]');
    const text = element.textContent;

    expect(text).toContain('DYNAMIC_FORM.LABORATORY');
  });
  it('should render subject name', () => {
    const element: HTMLSpanElement = fixture.debugElement.nativeElement.querySelector('span[data-automation-id="subject-name"]');
    const text: string = element.textContent;

    expect(text).toContain('math');
  });
  it('should render room name', () => {
    const element: HTMLParagraphElement = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="room-name"]');
    const text: string = element.textContent;

    expect(text).toContain('room1');
  });
  it('should render floor name', () => {
    const element: HTMLSpanElement = fixture.debugElement.nativeElement.querySelector('span[data-automation-id="floor-name"]');
    const text: string = element.textContent;

    expect(text).toContain('floor1');
  });
  it('should render building name', () => {
    const element: HTMLParagraphElement = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="building-name"]');
    const text: string = element.textContent;

    expect(text).toContain('build1');
  });
  it('should render date in EEEE, dd MMM, yyyy format', () => {
    const element: HTMLParagraphElement = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="booking-date"]');
    const text: string = element.textContent;

    expect(text).toContain('Sunday, 01 Jan, 2012');
  });
  it('should render start- end hour range', () => {
    const start: HTMLParagraphElement = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="start-hour"]');
    const end: HTMLParagraphElement = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="end-hour"]');
    const text = `${start.textContent}${end.textContent}`;

    expect(text).toContain('10-12');
  });
  it('should call onReschedule when reschedule button is clicked', () => {
    const rescheduleSpy = vi.spyOn(component, 'onReschedule');

    const rescheduleButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('button[data-automation-id="reschedule-button"]');
    rescheduleButton.click();

    expect(rescheduleSpy).toHaveBeenCalledOnce();
  });
  it('should emit booking id when reschedule button is called', () => {
    let emittedId: string | undefined;

    component.reschedule.subscribe((id) => {
      emittedId = id
    });

    const rescheduleButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('button[data-automation-id="reschedule-button"]');
    rescheduleButton.click();

    expect(emittedId).toBe('1');
  });
})

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimetableItemComponent } from './timetable-item.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { TimetableActivityVm } from './timetable-item.model';

describe('TimetableItemComponent', () => {
  let component: TimetableItemComponent;
  let fixture: ComponentFixture<TimetableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableItemComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(TimetableItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('day', 'MONDAY');
    fixture.componentRef.setInput('timetableItemSig', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose six timetable slots', () => {
    expect(component.dayItems()).toHaveLength(6);
  });

  it('should expose empty timetable slots when no activities are provided', () => {
    expect(component.dayItems().every(item =>
      !item.oddWeekActivity &&
      !item.evenWeekActivity &&
      !item.bothWeekActivity
    )).toBe(true);
  });

   it('should assign odd week activities to the correct slot', () => {
    const activity = {
      startHour: 10,
      weekParity: 'ODD',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    const slot = component.dayItems().find(i => i.startHour === 10);

    expect(slot?.oddWeekActivity).toEqual(activity);
    expect(slot?.evenWeekActivity).toBeUndefined();
    expect(slot?.bothWeekActivity).toBeUndefined();
  });

  it('should assign even week activities to the correct slot', () => {
    const activity = {
      startHour: 12,
      weekParity: 'EVEN',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    const slot = component.dayItems().find(i => i.startHour === 12);

    expect(slot?.evenWeekActivity).toEqual(activity);
  });

  it('should assign both week activities to the correct slot', () => {
    const activity = {
      startHour: 14,
      weekParity: 'BOTH',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    const slot = component.dayItems().find(i => i.startHour === 14);

    expect(slot?.bothWeekActivity).toEqual(activity);
  });

  it('should ignore activities with an unknown start hour', () => {
    const activity = {
      startHour: 22,
      weekParity: 'BOTH',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    expect(
      component.dayItems().every(item => !item.bothWeekActivity)
    ).toBe(true);
  });

  it('should return the first character of the activity type', () => {
    expect(component.getActivityTypeInitial('COURSE')).toBe('C');
  });

  it('should return an empty string for an empty activity type', () => {
    expect(component.getActivityTypeInitial('')).toBe('');
  });

  it('should render six timetable rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('mat-list-item');

    expect(rows).toHaveLength(6);
  });

  it('should render the hour intervals', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('08-10');
    expect(text).toContain('10-12');
    expect(text).toContain('12-14');
    expect(text).toContain('14-16');
    expect(text).toContain('16-18');
    expect(text).toContain('18-20');
  });

  it('should render the subject name', () => {
    const activity = {
      startHour: 8,
      weekParity: 'BOTH',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('SD');
  });

  it('should render the room name', () => {
    const activity = {
      startHour: 8,
      weekParity: 'BOTH',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('A101');
  });

  it('should render the activity type initial', () => {
    const activity = {
      startHour: 8,
      weekParity: 'BOTH',
      subjectItemShortName: 'SD',
      roomName: 'A101',
      activityType: 'COURSE',
    } as TimetableActivityVm;

    fixture.componentRef.setInput('timetableItemSig', [activity]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('C');
  });
});

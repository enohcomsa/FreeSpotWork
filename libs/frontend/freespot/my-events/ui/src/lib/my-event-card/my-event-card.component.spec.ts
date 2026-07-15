import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventCardComponent } from './my-event-card.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { MyEventCardVm } from './my-event-card.vm';

describe('TimetableItemComponent', () => {
  let component: MyEventCardComponent;
  let fixture: ComponentFixture<MyEventCardComponent>;

  const vm: MyEventCardVm = {
    id: 'event-1',
    name: 'Software Engineering',
    buildingName: 'Main Building',
    floorName: 'First Floor',
    roomName: 'A101',
    date: '2026-06-29',
    startHour: 8,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventCardComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(MyEventCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('vm', vm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the event name', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Software Engineering');
  });

  it('should render the building name', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Main Building');
  });


  it('should render the floor name', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('First Floor');
  });
  it('should render the room name', () => {//TO DO example
    const element = fixture.debugElement.nativeElement.querySelector('p[data-automation-id="room-name"]');
    const text = element.textContent;

    expect(text).toContain('A101');
  });


  it('should render the formatted event date', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Monday, 29 Jun, 2026');
  });

  it('should render the event time interval', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('8-10');
  });

  it('should render the special event label when the event name is empty', () => {
    const vm: MyEventCardVm = {
      id: 'event-1',
      name: '',
      buildingName: 'Main Building',
      floorName: 'First Floor',
      roomName: 'A101',
      date: '2026-06-29',
      startHour: 8,
    };

    fixture.componentRef.setInput('vm', vm);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('DYNAMIC_FORM.SPECIAL_EVENT');
  });

  it('should emit the event id when the delete button is clicked', () => {
    let emittedId: string | undefined;

    component.remove.subscribe((id) => {
      emittedId = id;
    });

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');

    deleteButton.click();

    expect(emittedId).toBe('event-1');
  });

  it('should call onRemove when the delete button is clicked', () => {
    const removeSpy = vi.spyOn(component, 'onRemove');

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');

    deleteButton.click();

    expect(removeSpy).toHaveBeenCalledOnce();
  });

});

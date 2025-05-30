import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';

import { FacultyComponent } from '../faculty/faculty.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  BookedEvent,
  Building,
  Faculty,
  Floor,
  FreeSpotUser,
  Room,
  SubjectItem,
  TimetableActivityItem,
  Year,
} from '@free-spot/models';
import { AddItemCardComponent, DynamicChipListComponent } from '@free-spot/ui';
import { AdminBuildingCardComponent } from '../admin-building-card/admin-building-card.component';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminBuildingService } from '@free-spot-service/building';
// import { FACULTY_LIST } from '@free-spot/constants';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { UserService } from '@free-spot-service/user';
import { Event, Role, WeekParity } from '@free-spot/enums';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { AdminEventService } from '@free-spot-service/event';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { filter, Subscription } from 'rxjs';
import { AdminRoomService } from '@free-spot-service/room';
import { BookingService } from '@free-spot-service/booking';

@Component({
  selector: 'free-spot-admin',

  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FacultyComponent,
    MatExpansionModule,
    DynamicChipListComponent,
    AdminBuildingCardComponent,
    AdminEventCardComponent,
    AddItemCardComponent,
    MatDatepickerModule,
    MatSelectModule
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit, OnDestroy {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _userService: UserService = inject(UserService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _bookingService: BookingService = inject(BookingService);

  editBuilding = viewChild<ElementRef>('editBuilding');
  editEvent = viewChild<ElementRef>('editEvent');
  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;
  eventListSig: Signal<Building[]> = this._adminEventService.eventListSig;
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  oldYearSig: WritableSignal<Year> = signal({} as Year);
  oldbuildingSig: WritableSignal<Building> = signal({} as Building);
  oldEventSig: WritableSignal<Building> = signal({} as Building);
  subscriptionList: Subscription[] = [];

  addingYear = false;
  editingYear = false;
  addYearFormControl = this._formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]);
  addingBuilding = false;
  editingBuilding = false;
  addBuildingFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    adress: ['', [Validators.required, Validators.minLength(3)]],
  });

  addingEvent = false;
  editingEvent = false;
  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  foundRoomListSig: WritableSignal<Room[]> = signal([]);
  addEventFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), [Validators.required]],
    startHour: [this.startHourList[0], [Validators.required]],
    building: [this.buildingListSig()[0], [Validators.required]],
    room: [{} as Room, [Validators.required]],
    unavailable: [0, [Validators.required]],
  });

  adminUserListSig: Signal<FreeSpotUser[]> = computed(
    () => this.userListSig().filter((user: FreeSpotUser) => user.role === Role.ADMIN) || [],
  );

  ngOnInit(): void {
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._userService.init();
    this._adminEventService.init();
    this._adminRoomService.init();
    this._bookingService.init();
    this.subscriptionList.push(
      this.addEventFormGroup.controls['building'].valueChanges
        .pipe(filter((building) => !!building))
        .subscribe((building: Building) => {
          this.foundRoomListSig.set(this._getBuildingRoomList(building));
          if (!this.editingEvent) {
            this.addEventFormGroup.controls['room'].reset();
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((subsciption: Subscription) => subsciption.unsubscribe());
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  updateAdminList(updatedAdminList: FreeSpotUser[]): void {
    if (this.adminUserListSig().length < updatedAdminList.length) {
      const oldUser: FreeSpotUser = updatedAdminList.filter(
        (admin: FreeSpotUser) =>
          this.adminUserListSig().find(
            (oldAdmin: FreeSpotUser) => oldAdmin.firstName === admin.firstName && oldAdmin.familyName === admin.familyName,
          ) === undefined,
      )[0];
      const addedAdmin: FreeSpotUser = { ...oldUser, role: Role.ADMIN };
      this._userService.updateFreeSpotUser(oldUser, addedAdmin);
    } else {
      const oldUser: FreeSpotUser = this.adminUserListSig().filter(
        (admin: FreeSpotUser) =>
          updatedAdminList.find(
            (oldAdmin: FreeSpotUser) => oldAdmin.firstName === admin.firstName && oldAdmin.familyName === admin.familyName,
          ) === undefined,
      )[0];
      const removedAdmin: FreeSpotUser = { ...oldUser, role: Role.MEMBER };
      this._userService.updateFreeSpotUser(oldUser, removedAdmin);
    }
  }

  onAddingYear(): void {
    this.addYearFormControl.reset();
    this.addingYear = true;
    this.editingYear = false;
  }

  onAddYear(faculty: Faculty): void {
    const newYear: Year = {
      name: this.addYearFormControl.value,
      yearGroupList: [],
    };

    const updatedFaculty: Faculty = { ...faculty, yearList: faculty.yearList ? [...faculty.yearList, newYear] : [newYear] };
    this._adminFacultyService.updateFaculty(faculty, updatedFaculty);
    this.addingYear = false;
    this.editingYear = false;
  }

  onEditingYear(yearToEdit: Year): void {
    this.editingYear = true;
    this.oldYearSig.set(yearToEdit);
    this.addYearFormControl.setValue(yearToEdit.name);
  }

  onEditYear(faculty: Faculty): void {
    const newYear: Year = {
      name: this.addYearFormControl.value,
      yearGroupList: this.oldYearSig().yearGroupList ? [...this.oldYearSig().yearGroupList] : [],
    };
    const updatedFaculty: Faculty = {
      ...faculty,
      yearList: faculty.yearList?.map((year: Year) => (year === this.oldYearSig() ? newYear : year)),
    };

    this._adminFacultyService.updateFaculty(faculty, updatedFaculty);
    this.addYearFormControl.reset();
    this.addingYear = false;
    this.editingYear = false;
  }

  onFacultyChange(changedFaculty: Faculty): void {
    const oldFaculty: Faculty =
      this.facultyListSig().find((faculty: Faculty) => faculty.name === changedFaculty.name) || ({} as Faculty);
    if (oldFaculty.name) {
      this._adminFacultyService.updateFaculty(oldFaculty, changedFaculty);
    }
    this.addingYear = false;
    this.editingYear = false;
  }

  onAddingBuilding(): void {
    this.addBuildingFormGroup.reset();
    this.addingBuilding = true;
    this.editingBuilding = false;
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddBuilding(): void {
    const newBuilding: Building = this._createBuilding(
      this.addBuildingFormGroup.controls['name'].value,
      this.addBuildingFormGroup.controls['adress'].value,
    );

    this._adminBuildingService.addBuilding(newBuilding);
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onEditingBuilding(buildingToEdit: Building): void {
    this.editingBuilding = true;
    this.oldbuildingSig.set(buildingToEdit);
    this.addBuildingFormGroup.setValue({ name: buildingToEdit.name, adress: buildingToEdit.adress });
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditBuilding(): void {
    const updatedBuilding: Building = {
      ...this._createBuilding(
        this.addBuildingFormGroup.controls['name'].value,
        this.addBuildingFormGroup.controls['adress'].value,
      ),
      floorList: this.oldbuildingSig().floorList ? this.oldbuildingSig().floorList : [],
    };
    this._adminBuildingService.updateBuilding(this.oldbuildingSig(), updatedBuilding);
    this.addBuildingFormGroup.reset();
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onDeleteBuilding(deletedBuilding: Building): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this building?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._adminBuildingService.deleteBuilding(deletedBuilding);
        }
      });
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onAddingEvent(): void {
    this.addEventFormGroup.reset();
    this.addingEvent = true;
    this.editingEvent = false;
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);
    const newEvent: Building = {
      name: this.addEventFormGroup.controls['name'].value,
      adress: this.addEventFormGroup.controls['building'].value.adress,
      floorList: [],
      specialEvent: true,
      building: this.addEventFormGroup.controls['building'].value.name,
      date: eventDate,
      roomName: this.addEventFormGroup.controls['room'].value.name,
      freeSpots:
        this.addEventFormGroup.controls['room'].value.totalSpotsNumber -
        this.addEventFormGroup.controls['room'].value.unavailableSpots -
        this.addEventFormGroup.controls['unavailable'].value,
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
      busySpots: 0,
      startHour: this.addEventFormGroup.controls['startHour'].value,
    };

    this._adminEventService.addEvent(newEvent);
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onEditingEvent(eventToEdit: Building): void {
    this.editingEvent = true;
    this.oldEventSig.set(eventToEdit);
    this.addEventFormGroup.setValue({
      name: eventToEdit.name,
      date: new Date(eventToEdit.date as Date),
      startHour: eventToEdit.startHour as number,
      building: this._adminBuildingService.getBuildingByName(eventToEdit.building as string)(),
      room: this._adminRoomService.getRoomByName(eventToEdit.roomName as string)() as Room,
      unavailable: eventToEdit.reservedSpots as number,
    });
    this.addEventFormGroup.controls['room'].setValue(
      this.foundRoomListSig().filter((room: Room) => room.name === eventToEdit.roomName)[0] as Room,
    );
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);
    const updatedEvent: Building = {
      name: this.addEventFormGroup.controls['name'].value,
      adress: this.addEventFormGroup.controls['building'].value.adress,
      floorList: [],
      specialEvent: true,
      building: this.addEventFormGroup.controls['building'].value.name,
      date: eventDate,
      roomName: this.addEventFormGroup.controls['room'].value.name,
      freeSpots:
        this.addEventFormGroup.controls['room'].value.totalSpotsNumber -
        this.addEventFormGroup.controls['room'].value.unavailableSpots -
        this.addEventFormGroup.controls['unavailable'].value -
        (this.oldEventSig().busySpots as number),
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
      busySpots: this.oldEventSig().busySpots,
      startHour: this.addEventFormGroup.controls['startHour'].value,
    };

    const timetableActivityFound: TimetableActivityItem = {
      startHour: updatedEvent.startHour as number,
      endHour: (updatedEvent.startHour as number) + 2,
      subjectItem: {} as SubjectItem,
      roomName: updatedEvent.roomName as string,
      activityType: Event.SPECIAL_EVENT,
      weekParity: WeekParity.BOTH,
      freeSpots: updatedEvent.freeSpots as number,
      busySpots: updatedEvent.busySpots as number,
      date: updatedEvent.date as Date,
      name: updatedEvent.name,
    };

    const eventBooking: BookedEvent = this._bookingService.generateBooking(timetableActivityFound);

    this.userListSig().forEach((user: FreeSpotUser) => {
      const newUserEventList: FreeSpotUser = {
        ...user,
        eventList: user.eventList?.map((event: BookedEvent) => (event.name === eventBooking.name ? eventBooking : event)),
      };
      this._userService.updateFreeSpotUser(user, newUserEventList);
    });

    this._adminEventService.updateEvent(this.oldEventSig(), updatedEvent);
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onDeleteEvent(deletedEvent: Building): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this event?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.userListSig().forEach((user: FreeSpotUser) => {
            const newUserEventList: FreeSpotUser = {
              ...user,
              eventList: user.eventList?.filter((event: BookedEvent) => event.name !== deletedEvent.name),
            };
            this._userService.updateFreeSpotUser(user, newUserEventList);
          });

          this._adminEventService.deleteEvent(deletedEvent);
        }
      });

    this.editingEvent = false;
    this.addingEvent = false;
  }

  private _createBuilding(buildingName: string, buildingAdress: string): Building {
    return {
      name: buildingName,
      adress: buildingAdress,
      floorList: [],
      specialEvent: false,
    };
  }

  private _getBuildingRoomList(building: Building): Room[] {
    const roomList: Room[] = [];
    building.floorList?.forEach((floor: Floor) => {
      floor.roomList?.forEach((room: Room) => {
        roomList.push(room);
      });
    });
    return roomList;
  }
}

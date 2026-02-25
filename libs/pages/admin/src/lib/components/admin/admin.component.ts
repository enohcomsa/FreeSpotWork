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
import { FreeSpotUser } from '@free-spot/models';
import { AddItemCardComponent, DynamicChipListComponent } from '@free-spot/ui';
import { AdminBuildingCardComponent } from '../admin-building-card/admin-building-card.component';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BuildingService } from '@free-spot-service/building';
import { BuildingCardService } from '@free-spot-service/building-card';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { UserService } from '@free-spot-service/user';
import { Role, } from '@free-spot/enums';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { AdminEventService } from '@free-spot-service/event';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { filter, Subscription } from 'rxjs';
import { AdminRoomService } from '@free-spot-service/room';
import { BookingService } from '@free-spot-service/booking';
import { Building, CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { Floor } from '@free-spot-domain/floor';
import { AdminFloorService } from '@free-spot-service/floor';
import { Faculty } from '@free-spot-domain/faculty';
import { Room } from '@free-spot-domain/room';
import { CreateSpecialEventCmd, SpecialEvent, UpdateSpecialEventCmd } from '@free-spot-domain/event';
import { EventTypeDTO } from '@free-spot/api-client';

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
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _adminBuildingCardService: BuildingCardService = inject(BuildingCardService);
  private _userService: UserService = inject(UserService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _bookingService: BookingService = inject(BookingService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);

  editBuilding = viewChild<ElementRef>('editBuilding');
  editEvent = viewChild<ElementRef>('editEvent');

  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;
  eventListSig: Signal<SpecialEvent[]> = this._adminEventService.eventListSig;
  readonly floorListSig: Signal<Floor[]> = this._adminFloorService.floorListSig;
  buildingSig: WritableSignal<BuildingCardVM> = signal({} as BuildingCardVM);
  specialEventSig: WritableSignal<SpecialEvent> = signal({} as SpecialEvent);
  subscriptionList: Subscription[] = [];
  //TO DO: fix update building card UI
  readonly buildingCardVMs: Signal<BuildingCardVM[]> = this._adminBuildingCardService.buildingCardListSig;

  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;

  addingBuilding = false;
  editingBuilding = false;
  addBuildingFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    adress: ['', [Validators.required, Validators.minLength(3)]],
  });

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  foundRoomListSig: WritableSignal<Room[]> = signal([]);
  addingEvent = false;
  editingEvent = false;
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
    this._adminBuildingCardService.init();
    this._adminFacultyService.init();
    this._userService.init();
    this._adminEventService.init();
    this._adminRoomService.init();
    this._bookingService.init();

    this.subscriptionList.push(
      this.addEventFormGroup.controls['building'].valueChanges
        .pipe(filter((building) => !!building))
        .subscribe((building: Building) => {
          this.foundRoomListSig.set(this._adminRoomService.selectRoomsByBuildingId(building.id)());
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

  getBuildingById(buildingId: string): Building {
    return this._adminBuildingService.getSignalById(buildingId)();
  }

  getRoomById(roomId: string): Room {
    return this._adminRoomService.getSignalById(roomId)();
  }

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

  onAddingBuilding(): void {
    this.addBuildingFormGroup.reset();
    this.addingBuilding = true;
    this.editingBuilding = false;
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddBuilding(): void {
    const newBuilding: CreateBuildingCmd = {
      name: this.addBuildingFormGroup.controls['name'].value,
      address: this.addBuildingFormGroup.controls['adress'].value,

    }
    this._adminBuildingService.create(newBuilding);
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onEditingBuildingVM(vm: BuildingCardVM): void {
    this.editingBuilding = true;
    this.addBuildingFormGroup.setValue({ name: vm.name, adress: vm.address });
    this.buildingSig.set(vm);
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditBuilding(): void {
    const updatedBuilding: UpdateBuildingCmd = {
      ...this.buildingSig(),
      name: this.addBuildingFormGroup.controls['name'].value,
      address: this.addBuildingFormGroup.controls['adress'].value,
    };
    this._adminBuildingService.update(this.buildingSig().id, updatedBuilding);
    this.addBuildingFormGroup.reset();
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onDeleteBuildingVM(vm: BuildingCardVM): void {
    this._confirmService.openConfirmDialog('Are you sure you want to delete this building?')
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this._adminBuildingService.remove(vm.id);
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

    const newSpecialEvent: CreateSpecialEventCmd = {
      type: EventTypeDTO.SPECIAL,
      name: this.addEventFormGroup.controls['name'].value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls['startHour'].value,
      buildingId: this.addEventFormGroup.controls['building'].value.id,
      roomId: this.addEventFormGroup.controls['room'].value.id,
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
    }

    this._adminEventService.create(newSpecialEvent);
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onEditingEvent(eventToEdit: SpecialEvent): void {
    this.editingEvent = true;
    this.addEventFormGroup.setValue({
      name: eventToEdit.name,
      date: new Date(eventToEdit.date ? new Date(eventToEdit?.date) : new Date()),
      startHour: eventToEdit.startHour as number,
      building: this._adminBuildingService.getSignalById(eventToEdit.buildingId)(),
      room: this._adminRoomService.getSignalById(eventToEdit.roomId)(),
      unavailable: eventToEdit.reservedSpots as number,
    });

    this.addEventFormGroup.controls['room'].setValue(
      this.foundRoomListSig().filter((room: Room) => room.id === eventToEdit.roomId)[0],
    );
    this.specialEventSig.set(eventToEdit);
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);

    const updatedSpecialEvent: UpdateSpecialEventCmd = {
      type: EventTypeDTO.SPECIAL,
      name: this.addEventFormGroup.controls['name'].value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls['startHour'].value,
      buildingId: this.addEventFormGroup.controls['building'].value.id,
      roomId: this.addEventFormGroup.controls['room'].value.id,
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
    }

    this._adminEventService.update(this.specialEventSig().id, updatedSpecialEvent);
    this.addEventFormGroup.reset();
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onDeleteEvent(deletedSpecialEventId: string): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this event?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {

          this._adminEventService.remove(deletedSpecialEventId);
        }
      });

    this.editingEvent = false;
    this.addingEvent = false;
  }
}

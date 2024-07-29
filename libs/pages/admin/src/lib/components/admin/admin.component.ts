import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyComponent } from '../faculty/faculty.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Building, Faculty, Floor, FreeSpotUser, Year } from '@free-spot/models';
import { AddItemCardComponent, DynamicChipListComponent } from '@free-spot/ui';
import { AdminBuildingCardComponent } from '../admin-building-card/admin-building-card.component';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminBuildingService } from '@free-spot-service/building';
// import { FACULTY_LIST } from '@free-spot/constants';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { UserService } from '@free-spot-service/user';
import { Role } from '@free-spot/enums';

@Component({
  selector: 'free-spot-admin',
  standalone: true,
  imports: [
    CommonModule,
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
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _userService: UserService = inject(UserService);

  editBuilding = viewChild<ElementRef>('editBuilding');
  editEvent = viewChild<ElementRef>('editEvent');
  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  oldYearSig: WritableSignal<Year> = signal({} as Year);
  oldbuildingSig: WritableSignal<Building> = signal({} as Building);

  addingYear = false;
  editingYear = false;
  addYearFormControl = this._formBuilder.nonNullable.control('');
  addingBuilding = false;
  editingBuilding = false;
  addBuildingFormGroup = this._formBuilder.nonNullable.group({
    name: [''],
    adress: [''],
  });

  addingEvent = false;
  addEventFormControl = this._formBuilder.control('');

  adminUserListSig: Signal<FreeSpotUser[]> = computed(
    () => this.userListSig().filter((user: FreeSpotUser) => user.role === Role.ADMIN) || [],
  );

  floorExp2: Floor = {
    name: '328',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 90,
    unavailableSpots: 10,
  };
  eventData: Building = {
    name: 'Simpozion',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp2],
    specialEvent: true,
    building: 'Laboratoare Observator',
    date: new Date('2024-08-14,16:30'),
  };

  ngOnInit(): void {
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._userService.init();
    // this.facultyList.forEach((fac) => this._adminFacultyService.addFaculty(fac));
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
    this._adminBuildingService.deleteBuilding(deletedBuilding);
  }

  ///////////////////////////EVENT
  onAddEvent(): void {
    this.addingEvent = false;
  }

  onEditEvent(): void {
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  private _createBuilding(buildingName: string, buildingAdress: string): Building {
    return {
      name: buildingName,
      adress: buildingAdress,
      floorList: [],
      specialEvent: false,
    };
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyComponent } from '../faculty/faculty.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Building, Faculty, Floor, SubjectItem } from '@free-spot/models';
import { DynamicChipListComponent } from '@free-spot/ui';
import { AdminBuildingCardComponent } from '../admin-building-card/admin-building-card.component';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FacultyComponent,
    MatExpansionModule,
    DynamicChipListComponent,
    AdminBuildingCardComponent,
    AdminEventCardComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _formBuilder: FormBuilder = inject(FormBuilder);

  editBuilding = viewChild<ElementRef>('editBuilding');
  editEvent = viewChild<ElementRef>('editEvent');

  admminUserList: string[] = ['enoh', 'dsada', 'dsggggg', 'bbbbbbbb', 'ffffffff', 'zzzzzzz'];

  subjectItem: SubjectItem = {
    name: 'subject 1',
    shortName: 'subj1',
    professor: 'string',
    roomList: [],
  };

  facultyItem: Faculty = {
    name: 'Electronica telecomunicatii si tehnologia informatiei',
    shortName: 'ETTI',
    subjectList: [this.subjectItem, this.subjectItem, this.subjectItem, this.subjectItem],
    yearList: [
      {
        name: '1',
        yearGroupList: [
          { name: 'gr1', studentList: [], timeTable: [] },
          { name: 'gr2', studentList: [], timeTable: [] },
          { name: 'gr3', studentList: [], timeTable: [] },
        ],
      },
      // {
      //   name: '2',
      //   yearGroupList: [
      //     { name: 'gr1', studentList: [], timeTable: [] },
      //     { name: 'gr2', studentList: [], timeTable: [] },
      //     { name: 'gr3', studentList: [], timeTable: [] },
      //   ],
      // },
      // {
      //   name: '3',
      //   yearGroupList: [
      //     { name: 'gr1', studentList: [], timeTable: [] },
      //     { name: 'gr2', studentList: [], timeTable: [] },
      //     { name: 'gr3', studentList: [], timeTable: [] },
      //   ],
      // },
      // {
      //   name: '4',
      //   yearGroupList: [
      //     { name: 'gr1', studentList: [], timeTable: [] },
      //     { name: 'gr2', studentList: [], timeTable: [] },
      //     { name: 'gr3', studentList: [], timeTable: [] },
      //   ],
      // },
    ],
  };

  facultyList: Faculty[] = [
    this.facultyItem,
    this.facultyItem,
    this.facultyItem,
    this.facultyItem,
    this.facultyItem,
    this.facultyItem,
    this.facultyItem,
  ];

  addingBuilding = false;
  addingEvent = false;
  addBuildingFormControl = this._formBuilder.control('');
  addEventFormControl = this._formBuilder.control('');

  floorExp: Floor = {
    name: 'UTCN Obs ground Floor',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 120,
    freeSpots: 90,
    busySpots: 20,
    unavailableSpots: 10,
  };
  floorExp2: Floor = {
    name: '328',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 90,
    freeSpots: 50,
    busySpots: 30,
    unavailableSpots: 10,
  };
  cardData: Building = {
    name: 'Laboratoare Observator',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp, this.floorExp2],
    specialEvent: false,
  };
  eventData: Building = {
    name: 'Simpozion',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp2],
    specialEvent: true,
    building: 'Laboratoare Observator',
    date: new Date('2024-08-14,16:30'),
  };

  onEditBuilding(): void {
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddBuilding(): void {
    this.addingBuilding = false;
  }

  onAddEvent(): void {
    this.addingEvent = false;
  }

  onFloorClick(florName: string): void {
    this._router.navigate(['floor/' + florName], { relativeTo: this._activatedRoute });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyComponent } from '../faculty/faculty.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Faculty, SubjectItem } from '@free-spot/models';
import { DynamicChipListComponent } from '@free-spot/ui';

@Component({
  selector: 'free-spot-admin',
  standalone: true,
  imports: [CommonModule, FacultyComponent, MatExpansionModule, DynamicChipListComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
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
}

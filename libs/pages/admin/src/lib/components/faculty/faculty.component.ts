import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, Signal } from '@angular/core';
import { Group, Year } from '@free-spot/models';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicChipListComponent } from '@free-spot/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { SubjectService } from '@free-spot-service/subject';
import { SubjectItem } from '@free-spot-domain/subject';
import { Faculty, UpdateFacultyCmd } from '@free-spot-domain/faculty';
import { AdminFacultyService } from '@free-spot-service/faculty';

@Component({
  selector: 'free-spot-faculty',
  imports: [MatListModule, MatDividerModule, DynamicChipListComponent, MatIconModule, MatTooltipModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent implements OnInit {
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _adminSubjectService: SubjectService = inject(SubjectService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);


  facultySig = input.required<Faculty>();
  subjectListSig: Signal<SubjectItem[]> = this._adminSubjectService.subjectListSig;
  facultySubjectListSig = computed(() => this.subjectListSig().filter((subject: SubjectItem) => this.facultySig().subjectList.includes(subject.id)));

  editYear = output<Year>();

  ngOnInit(): void {
    this._adminSubjectService.init();
  }

  deleteYear(deletedYear: Year): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this year?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          // this.facultySig.set({
          //   ...this.facultySig(),
          //   yearList: this.facultySig().yearList?.filter((year: Year) => year.name !== deletedYear.name),
          // });
        }
      });
  }

  onSubjectListChanged(newSubjectList: SubjectItem[]): void {
    const updatedFacluty: UpdateFacultyCmd = {
      subjectList: newSubjectList.map((subject: SubjectItem) => subject.id)
    }
    this._adminFacultyService.update(this.facultySig().id, updatedFacluty);
  }

  onYearGroupListChange(newYearGroupList: Group[], oldYear: Year): void {
    const changedYear: Year = { ...oldYear, yearGroupList: newYearGroupList };
    // this.facultySig.set({
    //   ...this.facultySig(),
    //   yearList: this.facultySig().yearList?.map((year: Year) => (year.name === changedYear.name ? changedYear : year)),
    // });
  }
}

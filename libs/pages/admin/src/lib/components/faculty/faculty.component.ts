import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';

import { FacultyLegacy, Group, SubjectItemLegacy, Year } from '@free-spot/models';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicChipListComponent } from '@free-spot/ui';
import { MatIconModule } from '@angular/material/icon';
import { SUBJECT_LIST } from '@free-spot/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';

@Component({
  selector: 'free-spot-faculty',

  imports: [MatListModule, MatDividerModule, DynamicChipListComponent, MatIconModule, MatTooltipModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent {
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);

  facultySig = model.required<FacultyLegacy>();
  subjectList: SubjectItemLegacy[] = SUBJECT_LIST;

  editYear = output<Year>();

  deleteYear(deletedYear: Year): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this year?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.facultySig.set({
            ...this.facultySig(),
            yearList: this.facultySig().yearList?.filter((year: Year) => year.name !== deletedYear.name),
          });
        }
      });
  }

  onSubjectListChanged(newSubjectList: SubjectItemLegacy[]): void {
    this.facultySig.set({ ...this.facultySig(), subjectList: newSubjectList });
  }

  onYearGroupListChange(newYearGroupList: Group[], oldYear: Year): void {
    const changedYear: Year = { ...oldYear, yearGroupList: newYearGroupList };
    this.facultySig.set({
      ...this.facultySig(),
      yearList: this.facultySig().yearList?.map((year: Year) => (year.name === changedYear.name ? changedYear : year)),
    });
  }
}

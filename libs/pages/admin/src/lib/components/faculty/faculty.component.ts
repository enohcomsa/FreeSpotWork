import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faculty, Group, SubjectItem, Year } from '@free-spot/models';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicChipListComponent } from '@free-spot/ui';
import { MatIconModule } from '@angular/material/icon';
import { SUBJECT_LIST } from '@free-spot/constants';

@Component({
  selector: 'free-spot-faculty',
  standalone: true,
  imports: [CommonModule, MatListModule, MatDividerModule, DynamicChipListComponent, MatIconModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent {
  facultySig = model.required<Faculty>();
  subjectList: SubjectItem[] = SUBJECT_LIST;

  editYear = output<Year>();
  deleteYear(deletedYear: Year): void {
    this.facultySig.set({
      ...this.facultySig(),
      yearList: this.facultySig().yearList?.filter((year: Year) => year.name !== deletedYear.name),
    });
  }

  onSubjectListChanged(newSubjectList: SubjectItem[]): void {
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

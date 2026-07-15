import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, Signal, viewChild, input } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalService } from '@free-spot/shared/ui';
import { DynamicChipListComponent, AddItemCardComponent } from '@free-spot/shared/ui';
import { FormErrorMessage } from '@free-spot/shared/util';
import { take } from 'rxjs';

import { AdminAcademicStructureStore } from '@free-spot/admin-academic-structure/data-access';
import {
  type AdminAcademicDegreeType,
  type AdminCohort,
  type AdminFaculty,
  type AdminProgram,
  type AdminProgramYear,
  type AdminSubjectItem,
  type CreateAdminCohortCmd,
  type CreateAdminProgramCmd,
  type CreateAdminProgramYearCmd,
  type UpdateAdminFacultyCmd,
  type UpdateAdminProgramCmd,
  type UpdateAdminProgramYearCmd,
} from '@free-spot/admin-academic-structure/domain';

@Component({
  selector: 'free-spot-faculty',
  imports: [
    MatListModule,
    MatDividerModule,
    DynamicChipListComponent,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    AddItemCardComponent,
    TranslateModule,
  ],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly store = inject(AdminAcademicStructureStore);
  private readonly router = inject(Router);

  editProgramRef = viewChild.required<ElementRef>('editProgram');
  editYearRef = viewChild.required<ElementRef>('editYear');

  facultySig = input.required<AdminFaculty>();

  subjectListSig: Signal<AdminSubjectItem[]> = this.store.subjectListSig;

  facultySubjectListSig = computed<AdminSubjectItem[]>(() =>
    this.subjectListSig().filter((subject) => this.facultySig().subjectList.includes(subject.id)),
  );

  facultyProgramsSig = computed<AdminProgram[]>(() => this.store.selectProgramsByFacultyId(this.facultySig().id)());

  facultyProgramYearsSig = computed<AdminProgramYear[]>(() => {
    const programYearList: AdminProgramYear[] = [];

    this.facultyProgramsSig().forEach((program) => {
      programYearList.push(...this.store.selectYearsByProgramId(program.id)());
    });

    return programYearList;
  });

  addingProgram = false;
  editingProgram = false;
  editingProgramId: string | null = null;

  degreeOptions: AdminAcademicDegreeType[] = ['LIC', 'MASTER', 'DOCT'];

  addProgramFormGroup = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    degree: ['LIC' as AdminAcademicDegreeType, Validators.required],
  });

  addingYear = false;
  editingYear = false;
  editingYearId: string | null = null;

  addYearFormGroup = this.formBuilder.nonNullable.group({
    label: ['', [Validators.required, Validators.minLength(1)]],
    yearNumber: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
    programId: ['', Validators.required],
  });

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  getProgramById(programId: string): AdminProgram | undefined {
    return this.store.getProgramById(programId)();
  }

  getCohortNameListSignalByYearId(yearId: string): Signal<AdminCohort[]> {
    return this.store.selectGroupsByProgramYearId(yearId);
  }

  onAddingProgram(): void {
    this.addProgramFormGroup.reset({ name: '', degree: 'LIC' });
    this.editingProgram = false;
    this.editingProgramId = null;
    this.addingProgram = true;
    this.editProgramRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddProgram(): void {
    const newProgram: CreateAdminProgramCmd = {
      facultyId: this.facultySig().id,
      name: this.addProgramFormGroup.controls.name.value,
      degree: this.addProgramFormGroup.controls.degree.value,
      active: true,
    };

    this.store.createProgram(newProgram);
    this.resetProgramFormState();
  }

  onEditingProgram(programToEdit: AdminProgram): void {
    this.editingProgram = true;
    this.editingProgramId = programToEdit.id;

    this.addProgramFormGroup.patchValue({
      name: programToEdit.name,
      degree: programToEdit.degree ?? 'LIC',
    });

    this.addingProgram = true;
    this.editProgramRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditProgram(): void {
    if (!this.editingProgramId) {
      return;
    }

    const updatedProgram: UpdateAdminProgramCmd = {
      name: this.addProgramFormGroup.controls.name.value,
      degree: this.addProgramFormGroup.controls.degree.value,
    };

    this.store.updateProgram(this.editingProgramId, updatedProgram);
    this.resetProgramFormState();
  }

  onDeleteProgram(programIdToDelete: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this program?')
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.store.deleteProgram(programIdToDelete);
          this.resetProgramFormState();
        }
      });
  }

  onAddingYear(): void {
    this.addYearFormGroup.reset({ label: '', yearNumber: 1 });
    this.editingYear = false;
    this.editingYearId = null;
    this.addingYear = true;
    this.editYearRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddYear(): void {
    const newProgramYear: CreateAdminProgramYearCmd = {
      programId: this.addYearFormGroup.controls.programId.value,
      label: this.addYearFormGroup.controls.label.value,
      yearNumber: this.addYearFormGroup.controls.yearNumber.value,
    };

    this.store.createProgramYear(newProgramYear);
    this.resetYearFormState();
  }

  onEditingYear(programYearToEdit: AdminProgramYear): void {
    this.editingYear = true;
    this.editingYearId = programYearToEdit.id;

    this.addYearFormGroup.patchValue({
      programId: programYearToEdit.programId,
      label: programYearToEdit.label,
      yearNumber: programYearToEdit.yearNumber ?? 1,
    });

    this.addingYear = true;
    this.editYearRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditYear(): void {
    if (!this.editingYearId) {
      return;
    }

    const updatedYear: UpdateAdminProgramYearCmd = {
      programId: this.addYearFormGroup.controls.programId.value,
      label: this.addYearFormGroup.controls.label.value,
      yearNumber: this.addYearFormGroup.controls.yearNumber.value,
    };

    this.store.updateProgramYear(this.editingYearId, updatedYear);
    this.resetYearFormState();
  }

  onDeleteYear(programYearIdToDelete: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this program year?')
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.store.deleteProgramYear(programYearIdToDelete);
          this.resetYearFormState();
        }
      });
  }

  onSubjectListChanged(newSubjectList: AdminSubjectItem[]): void {
    const updatedFaculty: UpdateAdminFacultyCmd = {
      subjectList: newSubjectList.map((subject) => subject.id),
    };

    this.store.updateFaculty(this.facultySig().id, updatedFaculty);
  }

  onYearGroupListChange(newYearGroupList: AdminCohort[], yearId: string): void {
    const existingCohorts = this.store.selectGroupsByProgramYearId(yearId)();
    const existingNames = new Set(existingCohorts.map((cohort) => cohort.name));
    const newNames = new Set(newYearGroupList.map((cohort) => cohort.name));
    const addedGroup = newYearGroupList.find((cohort) => !existingNames.has(cohort.name));
    const removedCohort = existingCohorts.find((cohort) => !newNames.has(cohort.name));

    if (addedGroup) {
      const newCohort: CreateAdminCohortCmd = {
        type: 'GROUP',
        programYearId: yearId,
        name: addedGroup.name,
      };

      this.store.createCohort(newCohort);
      return;
    }

    if (removedCohort) {
      this.store.deleteCohort(removedCohort.id);
    }
  }

  navigateToGroup(group: AdminCohort) {
    this.router.navigate(['/admin', 'group', group.id]);
  }

  private resetProgramFormState(): void {
    this.addProgramFormGroup.reset();
    this.addingProgram = false;
    this.editingProgram = false;
    this.editingProgramId = null;
  }

  private resetYearFormState(): void {
    this.addYearFormGroup.reset();
    this.addingYear = false;
    this.editingYear = false;
    this.editingYearId = null;
  }
}

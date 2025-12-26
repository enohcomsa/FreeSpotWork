import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnInit, Signal, viewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AddItemCardComponent, DynamicChipListComponent } from '@free-spot/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { SubjectService } from '@free-spot-service/subject';
import { SubjectItem } from '@free-spot-domain/subject';
import { Faculty, UpdateFacultyCmd } from '@free-spot-domain/faculty';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { CreateProgramCmd, Program, UpdateProgramCmd } from '@free-spot-domain/program';
import { ProgramService } from '@free-spot-service/program';
import { CohortTypeDTO, DegreeDTO } from '@free-spot/api-client';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorMessage } from '@free-spot/util';
import { take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ProgramYearService } from '@free-spot-service/program-year';
import { CreateProgramYearCmd, ProgramYear, UpdateProgramYearCmd } from '@free-spot-domain/program-year';
import { CohortService } from '@free-spot-service/cohort';
import { Cohort, CreateCohortCmd } from '@free-spot-domain/cohort';

@Component({
  selector: 'free-spot-faculty',
  imports: [MatListModule, MatDividerModule, DynamicChipListComponent, MatIconModule, MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule, CommonModule, MatButtonModule, MatChipsModule, AddItemCardComponent],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _adminSubjectService: SubjectService = inject(SubjectService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminProgramService: ProgramService = inject(ProgramService);
  private _adminProgramYearService: ProgramYearService = inject(ProgramYearService);
  private _adminCohortService: CohortService = inject(CohortService);

  editProgramRef = viewChild.required<ElementRef>('editProgram');
  editYearRef = viewChild.required<ElementRef>('editYear');
  facultySig = input.required<Faculty>();
  subjectListSig: Signal<SubjectItem[]> = this._adminSubjectService.subjectListSig;
  facultySubjectListSig = computed(() => this.subjectListSig().filter((subject: SubjectItem) => this.facultySig().subjectList.includes(subject.id)));
  facultyProgramsSig = computed(() => {
    const faculty = this.facultySig();
    if (!faculty) return [];
    return this._adminProgramService.selectProgramsByFacultyId(faculty.id)();
  });
  facultyProgramYearsSig = computed(() => {
    const programYearList: ProgramYear[] = [];
    this.facultyProgramsSig().forEach((program: Program) =>
      programYearList.push(...this._adminProgramYearService.selectYearByProgramId(program.id)()))
    return programYearList;
  });

  addingProgram = false;
  editingProgram = false;
  editingProgramId: string | null = null;
  degreeOptions = [DegreeDTO.LIC, DegreeDTO.MASTER, DegreeDTO.DOCT];

  addProgramFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    degree: [DegreeDTO.LIC, Validators.required],
  });

  addingYear = false;
  editingYear = false;
  editingYearId: string | null = null;

  addYearFormGroup = this._formBuilder.nonNullable.group({
    label: ['', [Validators.required, Validators.minLength(1)]],
    yearNumber: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
    programId: ['', Validators.required]
  });

  ngOnInit(): void {
    this._adminSubjectService.init();
    this._adminProgramService.init();
    this._adminProgramYearService.init();
    this._adminCohortService.init();
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  getProgramById(programId: string): Program {
    return this._adminProgramService.getSignalById(programId)();
  }

  getCohortNameListSignalByYearId(yearId: string): Signal<string[]> {
    return computed(() => this._adminCohortService.selectCohortsByProgramYearId(yearId)().map((cohort: Cohort) => cohort.name));
  }

  onAddingProgram(): void {
    this.addProgramFormGroup.reset({ name: '', degree: DegreeDTO.LIC });
    this.editingProgram = false;
    this.editingProgramId = null;
    this.addingProgram = true;
    this.editProgramRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddProgram(): void {
    const faculty = this.facultySig();
    if (!faculty?.id) return;

    const newProgram: CreateProgramCmd = {
      facultyId: faculty.id,
      name: this.addProgramFormGroup.controls['name'].value,
      degree: this.addProgramFormGroup.controls['degree'].value,
      active: true,
    };

    this._adminProgramService.create(newProgram);
    this._resetProgramFormState();
  }

  onEditingProgram(programToEdit: Program): void {
    this.editingProgram = true;
    this.editingProgramId = programToEdit.id;

    this.addProgramFormGroup.patchValue({
      name: programToEdit.name,
      degree: programToEdit.degree ?? DegreeDTO.LIC
    });

    this.addingProgram = true;
    this.editProgramRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditProgram(): void {
    if (!this.editingProgramId) return;

    const updatedProgram: UpdateProgramCmd = {
      name: this.addProgramFormGroup.controls['name'].value,
      degree: this.addProgramFormGroup.controls['degree'].value,
    };

    this._adminProgramService.update(this.editingProgramId, updatedProgram);
    this._resetProgramFormState();
  }

  onDeleteProgram(programIdToDelete: string): void {
    this._confirmService.openConfirmDialog('Are you sure you want to delete this program?')
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this._adminProgramService.remove(programIdToDelete);
          this._resetProgramFormState();
        }
      });
  }

  private _resetProgramFormState(): void {
    this.addProgramFormGroup.reset();
    this.addingProgram = false;
    this.editingProgram = false;
    this.editingProgramId = null;
  }

  onAddingYear(): void {
    this.addYearFormGroup.reset({ label: '', yearNumber: 1 });
    this.editingYear = false;
    this.editingYearId = null;
    this.addingYear = true;
    this.editYearRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddYear(): void {
    const newProgramYear: CreateProgramYearCmd = {
      programId: this.addYearFormGroup.controls['programId'].value,
      label: this.addYearFormGroup.controls['label'].value,
      yearNumber: this.addYearFormGroup.controls['yearNumber'].value,
    };

    this._adminProgramYearService.create(newProgramYear);
    this._resetYearFormState();
  }

  onEditingYear(programYearToEdit: ProgramYear): void {
    this.editingYear = true;
    this.editingYearId = programYearToEdit.id;

    this.addYearFormGroup.patchValue({
      programId: programYearToEdit.programId,
      label: programYearToEdit.label,
      yearNumber: programYearToEdit.yearNumber ?? 1
    });

    this.addingYear = true;
    this.editYearRef()?.nativeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditYear(): void {
    if (!this.editingYearId) return;
    const updatedYear: UpdateProgramYearCmd = {
      programId: this.addYearFormGroup.controls['programId'].value,
      label: this.addYearFormGroup.controls['label'].value,
      yearNumber: this.addYearFormGroup.controls['yearNumber'].value,
    }

    this._adminProgramYearService.update(this.editingYearId, updatedYear);
    this._resetYearFormState();
  }

  onDeleteYear(programYearIdToDelete: string): void {
    this._confirmService.openConfirmDialog('Are you sure you want to delete this program?')
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this._adminProgramYearService.remove(programYearIdToDelete);
          this._resetYearFormState();
        }
      });
  }

  private _resetYearFormState(): void {
    this.addYearFormGroup.reset();
    this.addingYear = false;
    this.editingYear = false;
    this.editingYearId = null;
  }

  onSubjectListChanged(newSubjectList: SubjectItem[]): void {
    const updatedFacluty: UpdateFacultyCmd = {
      subjectList: newSubjectList.map((subject: SubjectItem) => subject.id)
    }
    this._adminFacultyService.update(this.facultySig().id, updatedFacluty);
  }

  onYearGroupListChange(newYearGroupList: string[], yearId: string): void {
    const existingCohorts: Cohort[] = this._adminCohortService.selectCohortsByProgramYearId(yearId)();
    const existingNames = new Set(existingCohorts.map((cohort: Cohort) => cohort.name));
    const newNames = new Set(newYearGroupList.map((group: string) => group));

    if (newYearGroupList.length > existingCohorts.length) {
      const addedGroup: string | undefined = newYearGroupList.find((group: string) => !existingNames.has(group));
      if (addedGroup) {
        const newCohort: CreateCohortCmd = {
          type: CohortTypeDTO.GROUP,
          programYearId: yearId,
          name: addedGroup,
        }
        this._adminCohortService.create(newCohort);
      }
    } else if (newYearGroupList.length < existingCohorts.length) {
      const removedCohort: Cohort | undefined = existingCohorts.find((cohort: Cohort) => !newNames.has(cohort.name));
      if (removedCohort?.id) {
        this._adminCohortService.remove(removedCohort.id);
      }
    }
  }
}

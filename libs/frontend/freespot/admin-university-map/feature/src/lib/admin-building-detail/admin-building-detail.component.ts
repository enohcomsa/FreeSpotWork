import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminUniversityMapStore } from '@free-spot/admin-university-map/data-access';
import {
  type AdminUniversityMapFloorVM,
  type CreateAdminUniversityMapFloorCmd,
  type UpdateAdminUniversityMapFloorCmd,
} from '@free-spot/admin-university-map/domain';
import { AdminFloorCardComponent } from '@free-spot/admin-university-map/ui';
import { ConfirmModalService } from '@free-spot/core/ui';
import { AddItemCardComponent } from '@free-spot/ui';
import { FormErrorMessage } from '@free-spot/util';

@Component({
  selector: 'free-spot-admin-building-detail',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminFloorCardComponent,
    AddItemCardComponent,
  ],
  templateUrl: './admin-building-detail.component.html',
  styleUrl: './admin-building-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingDetailComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly store = inject(AdminUniversityMapStore);

  editFloor = viewChild<ElementRef>('editFloor');
  buildingIdSig = input.required<string>();

  readonly editingFloorIdSig: WritableSignal<string | null> = signal(null);
  readonly buildingSig = computed(() => this.store.getBuildingById(this.buildingIdSig())());
  readonly buildingFloorList = computed(() => this.store.selectFloorsByBuildingId(this.buildingIdSig())());
  readonly floorCardVMs = computed<AdminUniversityMapFloorVM[]>(() =>
    this.store.selectFloorVMsByBuildingId(this.buildingIdSig())(),
  );

  addingFloor = false;
  editingFloor = false;

  addFloorFormControl = this.formBuilder.nonNullable.control('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  ngOnInit(): void {
    this.store.init();
  }

  displayError = (control: AbstractControl | null): string =>
    this.formErrorMessage.displayFormErrorMessage(control);

  onAddingFloor(): void {
    this.addFloorFormControl.reset();
    this.editingFloorIdSig.set(null);
    this.editingFloor = false;
    this.addingFloor = true;
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddFloor(): void {
    const newFloor: CreateAdminUniversityMapFloorCmd = {
      buildingId: this.buildingIdSig(),
      name: this.addFloorFormControl.value,
    };

    this.store.createFloor(newFloor);
    this.resetFormState();
  }

  onEditingFloor(floorToEdit: AdminUniversityMapFloorVM): void {
    this.editingFloor = true;
    this.addingFloor = true;
    this.editingFloorIdSig.set(floorToEdit.id);
    this.addFloorFormControl.setValue(floorToEdit.name);
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditFloor(): void {
    const id = this.editingFloorIdSig();

    if (!id) {
      return;
    }

    const updatedFloor: UpdateAdminUniversityMapFloorCmd = {
      name: this.addFloorFormControl.value,
    };

    this.store.updateFloor(id, updatedFloor);
    this.resetFormState();
  }

  onDeleteFloor(deletedFloor: AdminUniversityMapFloorVM): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this floor?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.removeFloor(deletedFloor.id);
          this.resetFormState();
        }
      });
  }

  private resetFormState(): void {
    this.addFloorFormControl.reset();
    this.editingFloorIdSig.set(null);
    this.editingFloor = false;
    this.addingFloor = false;
  }
}

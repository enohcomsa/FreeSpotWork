import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ConfirmModalService } from '@free-spot/core/ui';
import { AddItemCardComponent } from '@free-spot/ui';
import { FormErrorMessage } from '@free-spot/util';
import { AdminBuildingCardComponent } from '@free-spot/admin-university-map/ui';
import { AdminUniversityMapStore } from '@free-spot/admin-university-map/data-access';
import {
  AdminUniversityMapBuildingCard,
  CreateAdminUniversityMapBuildingCmd,
  UpdateAdminUniversityMapBuildingCmd,
} from '@free-spot/admin-university-map/domain';

@Component({
  selector: 'free-spot-admin-university-map',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminBuildingCardComponent,
    AddItemCardComponent,
  ],
  templateUrl: './admin-university-map.component.html',
  styleUrl: './admin-university-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUniversityMapComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly adminUniversityMapStore = inject(AdminUniversityMapStore);

  editBuilding = viewChild<ElementRef>('editBuilding');

  readonly buildingCardVMs: Signal<AdminUniversityMapBuildingCard[]> =
    this.adminUniversityMapStore.buildingCardVMs;
  readonly buildingSig: WritableSignal<AdminUniversityMapBuildingCard> =
    signal({} as AdminUniversityMapBuildingCard);

  addingBuilding = false;
  editingBuilding = false;

  addBuildingFormGroup = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    adress: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.adminUniversityMapStore.init();
  }

  displayError = (control: AbstractControl | null) =>
    this.formErrorMessage.displayFormErrorMessage(control);

  onAddingBuilding(): void {
    this.addBuildingFormGroup.reset();
    this.addingBuilding = true;
    this.editingBuilding = false;
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddBuilding(): void {
    const newBuilding: CreateAdminUniversityMapBuildingCmd = {
      name: this.addBuildingFormGroup.controls.name.value,
      address: this.addBuildingFormGroup.controls.adress.value,
    };

    this.adminUniversityMapStore.create(newBuilding);
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onEditingBuildingVM(vm: AdminUniversityMapBuildingCard): void {
    this.editingBuilding = true;
    this.addBuildingFormGroup.setValue({ name: vm.name, adress: vm.address });
    this.buildingSig.set(vm);
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditBuilding(): void {
    const updatedBuilding: UpdateAdminUniversityMapBuildingCmd = {
      name: this.addBuildingFormGroup.controls.name.value,
      address: this.addBuildingFormGroup.controls.adress.value,
    };

    this.adminUniversityMapStore.update(this.buildingSig().id, updatedBuilding);
    this.addBuildingFormGroup.reset();
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onDeleteBuildingVM(vm: AdminUniversityMapBuildingCard): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this building?')
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.adminUniversityMapStore.remove(vm.id);
        }
      });

    this.addingBuilding = false;
    this.editingBuilding = false;
  }
}

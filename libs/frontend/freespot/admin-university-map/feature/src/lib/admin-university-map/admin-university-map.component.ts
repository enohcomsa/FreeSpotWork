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

import { CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { ConfirmModalService } from '@free-spot/core/ui';
import { AddItemCardComponent } from '@free-spot/ui';
import { FormErrorMessage } from '@free-spot/util';
import { AdminBuildingCardComponent } from '@free-spot/admin-university-map/ui';
import { AdminUniversityMapStore } from '@free-spot/admin-university-map/data-access';

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
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminUniversityMapStore = inject(AdminUniversityMapStore);

  editBuilding = viewChild<ElementRef>('editBuilding');

  readonly buildingCardVMs: Signal<BuildingCardVM[]> = this._adminUniversityMapStore.buildingCardVMs;
  readonly buildingSig: WritableSignal<BuildingCardVM> = signal({} as BuildingCardVM);

  addingBuilding = false;
  editingBuilding = false;

  addBuildingFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    adress: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this._adminUniversityMapStore.init();
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  onAddingBuilding(): void {
    this.addBuildingFormGroup.reset();
    this.addingBuilding = true;
    this.editingBuilding = false;
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddBuilding(): void {
    const newBuilding: CreateBuildingCmd = {
      name: this.addBuildingFormGroup.controls['name'].value,
      address: this.addBuildingFormGroup.controls['adress'].value,
    };

    this._adminUniversityMapStore.create(newBuilding);
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onEditingBuildingVM(vm: BuildingCardVM): void {
    this.editingBuilding = true;
    this.addBuildingFormGroup.setValue({ name: vm.name, adress: vm.address });
    this.buildingSig.set(vm);
    this.editBuilding()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditBuilding(): void {
    const updatedBuilding: UpdateBuildingCmd = {
      ...this.buildingSig(),
      name: this.addBuildingFormGroup.controls['name'].value,
      address: this.addBuildingFormGroup.controls['adress'].value,
    };

    this._adminUniversityMapStore.update(this.buildingSig().id, updatedBuilding);
    this.addBuildingFormGroup.reset();
    this.addingBuilding = false;
    this.editingBuilding = false;
  }

  onDeleteBuildingVM(vm: BuildingCardVM): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this building?')
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this._adminUniversityMapStore.remove(vm.id);
        }
      });

    this.addingBuilding = false;
    this.editingBuilding = false;
  }
}

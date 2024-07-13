import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'free-spot-dynamic-chip-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './dynamic-chip-list.component.html',
  styleUrl: './dynamic-chip-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicChipListComponent<T> {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  itemListSig = input.required<T[]>();
  itemLabelSig = input.required<string>();
  optionListSig = input<T[]>();
  itemKeyDysplay = input<keyof T>();
  itemDinamicRoute = input<string>('');
  addItem = output<T>();
  removeItem = output<T>();
  addItemFormControl = this._formBuilder.control('');
  addingItem = false;

  onAddItem(): void {
    this.addingItem = false;

    this.addItem.emit(this.getAddedItem(this.addItemFormControl.value || ''));
    this.addItemFormControl.reset();
  }

  getDisplayName(item: T): string {
    return item[this.itemKeyDysplay() as keyof T] as string;
  }

  onFloorClick(florName: string): void {
    this._router.navigate([this.itemDinamicRoute() + florName], { relativeTo: this._activatedRoute });
  }

  onDynamicNavigation(item: T): void {
    if (this.itemDinamicRoute() !== '') {
      this._router.navigate([this.itemDinamicRoute() + this.getDisplayName(item)], { relativeTo: this._activatedRoute });
    }
  }

  getAddedItem(itemName: string): T {
    if (this.itemKeyDysplay()) {
      return this.optionListSig()?.find((addedItem) => this.getDisplayName(addedItem) === itemName) as T;
    } else {
      return this.optionListSig()?.find((addedItem) => addedItem === itemName) as T;
    }
  }
}

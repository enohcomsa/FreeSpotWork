import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, Signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from "../confirm-modal.service";
import { FormErrorMessage } from '@free-spot/shared/util';

@Component({
  selector: 'free-spot-dynamic-chip-list',
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
    MatTooltipModule,
  ],
  templateUrl: './dynamic-chip-list.component.html',
  styleUrl: './dynamic-chip-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicChipListComponent<T> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);

  itemListSig = model.required<T[]>();
  itemLabelSig = input.required<string>();
  optionListSig = input<T[]>([]);
  itemKeyDysplay = input<keyof T>();
  itemKeyDysplay2 = input<keyof T>();
  deletableItemListSig = input<T[]>();
  selectable = input(false);

  itemSelected = output<T>();

  addItemFormControl = this.formBuilder.nonNullable.control({} as T, Validators.required);
  addingItem = false;

  filteredOptionListSig: Signal<T[]> = computed(() => {
    const filteredOptions = this.optionListSig().filter(
      (option) =>
        !this.itemListSig().some(
          (item) => item[this.itemKeyDysplay() as keyof T] === option[this.itemKeyDysplay() as keyof T],
        ),
    );

    if (this.optionListSig().length) {
      if (filteredOptions.length) {
        this.addItemFormControl.enable();
        this.addItemFormControl.setValue(filteredOptions[0]);
      } else {
        this.addItemFormControl.disable();
      }
    }

    return filteredOptions;
  });

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  onAddItem(): void {
    this.addingItem = false;
    this.itemListSig.set([...this.itemListSig(), this.addItemFormControl.value]);
    this.addItemFormControl.reset();
  }

  onRemoveItem(removedItem: T): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this item?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.itemListSig.set(this.itemListSig().filter((item) => item !== removedItem));
        }
      });
  }

  onItemSelected(item: T): void {
    if (!this.selectable()) {
      return;
    }

    this.itemSelected.emit(item);
  }

  getDisplayName(item: T): string {
    if (item === undefined || item === null || (typeof item === 'object' && !Object.keys(item).length)) {
      return '';
    }

    const firstKey = this.itemKeyDysplay();
    const secondKey = this.itemKeyDysplay2();

    if (!firstKey) {
      return String(item);
    }

    if (secondKey) {
      return `${String(item[firstKey])} ${String(item[secondKey])}`;
    }

    return String(item[firstKey]);
  }

  getAddedItem(itemName: string): T {
    if (this.itemKeyDysplay()) {
      return this.optionListSig().find((addedItem) => this.getDisplayName(addedItem) === itemName) as T;
    }

    return this.optionListSig().find((addedItem) => addedItem === itemName) as T;
  }

  canBeDeleted(item: T): boolean {
    const deletableItems = this.deletableItemListSig();

    if (!deletableItems) {
      return true;
    }

    return deletableItems.some(
      (deletableItem) =>
        deletableItem[this.itemKeyDysplay() as keyof T] === item[this.itemKeyDysplay() as keyof T] &&
        deletableItem[this.itemKeyDysplay2() as keyof T] === item[this.itemKeyDysplay2() as keyof T],
    );
  }
}

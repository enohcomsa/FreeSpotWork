import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeTableItemLecagy } from '@free-spot/models';
import { WeekDay } from '@free-spot/enums';
import { AppDateService } from '@free-spot-service/app-date';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';

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
export class DynamicChipListComponent<T> implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _appDateService: AppDateService = inject(AppDateService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  itemListSig = model.required<T[]>();
  itemLabelSig = input.required<string>();
  optionListSig = input<T[]>([]);
  itemKeyDysplay = input<keyof T>();
  itemKeyDysplay2 = input<keyof T>();
  itemDinamicRoute = input<string>('');
  deletableItemListSig = input<T[]>();

  filteredOptionListSig: Signal<T[]> = computed(() => {
    const filterdOptions: T[] =
      this.optionListSig()?.filter(
        (option: T) =>
          !this.itemListSig().some(
            (item: T) => item[this.itemKeyDysplay() as keyof T] === option[this.itemKeyDysplay() as keyof T],
          ),
      ) || [];
    if (this.optionListSig()?.length) {
      if (filterdOptions.length) {
        this.addItemFormControl.enable();
        this.addItemFormControl.setValue(filterdOptions[0]);
      } else {
        this.addItemFormControl.disable();
      }
    }

    return filterdOptions;
  });

  addItemFormControl = this._formBuilder.nonNullable.control({} as T, Validators.required);
  addingItem = false;

  // emptyTimetable: Signal<TimeTableItemLecagy[]> = computed(() => [
  //   { weekDay: WeekDay.MONDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.MONDAY) },
  //   { weekDay: WeekDay.TUESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.TUESDAY) },
  //   { weekDay: WeekDay.WEDNESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.WEDNESDAY) },
  //   { weekDay: WeekDay.THURSDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.THURSDAY) },
  //   { weekDay: WeekDay.FRIDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.FRIDAY) },
  // ]);

  ngOnInit(): void {
    this._appDateService.init();
    if (this.optionListSig()?.length) {
      this.addItemFormControl.setValue(this.filteredOptionListSig()[0]);
      if (!this.filteredOptionListSig().length) {
        this.addItemFormControl.disable();
      }
    }
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  onAddItem(): void {
    this.addingItem = false;
    this.itemListSig.set([...this.itemListSig(), this.addItemFormControl.value as T]);
    this.addItemFormControl.reset();
  }

  onRemoveItem(removedItem: T): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this item?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.itemListSig.set(this.itemListSig().filter((item: T) => item !== removedItem));
        }
      });
  }

  getDisplayName(item: T): string {
    if (item !== undefined && item !== null && (typeof item === 'object' ? Object.keys(item).length : true)) {
      if (this.itemKeyDysplay2() !== undefined && this.itemKeyDysplay2() !== null) {
        return ((item[this.itemKeyDysplay() as keyof T] as string) + ' ' + item[this.itemKeyDysplay2() as keyof T]) as string;
      } else {
        return item[this.itemKeyDysplay() as keyof T] as string;
      }
    } else {
      return '';
    }
  }

  onFloorClick(florName: string): void {
    this._router.navigate([this.itemDinamicRoute() + florName], { relativeTo: this._activatedRoute });
  }

  onDynamicNavigation(item: T): void {
    if (this.itemDinamicRoute() !== '' && this._hasId(item)) {
      this._router.navigate([this.itemDinamicRoute() + item.id], { relativeTo: this._activatedRoute });
    }
  }

  getAddedItem(itemName: string): T {
    if (this.itemKeyDysplay()) {
      return this.optionListSig()?.find((addedItem) => this.getDisplayName(addedItem) === itemName) as T;
    } else {
      return this.optionListSig()?.find((addedItem) => addedItem === itemName) as T;
    }
  }

  canBeDeleted(item: T): boolean {
    let canBeDeleted = true;
    if (this.deletableItemListSig() !== undefined && this.deletableItemListSig() !== null) {
      canBeDeleted =
        this.deletableItemListSig()?.some(
          (deleteableItem: T) =>
            deleteableItem[this.itemKeyDysplay() as keyof T] === item[this.itemKeyDysplay() as keyof T] &&
            deleteableItem[this.itemKeyDysplay2() as keyof T] === item[this.itemKeyDysplay2() as keyof T],
        ) ?? true;
    }

    return canBeDeleted;
  }

  private _hasId(item: unknown): item is { id: string } {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof item.id === 'string'
    );
  }
}

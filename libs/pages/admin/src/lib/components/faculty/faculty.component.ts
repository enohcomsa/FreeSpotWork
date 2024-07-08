import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faculty } from '@free-spot/models';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicChipListComponent } from '@free-spot/ui';

@Component({
  selector: 'free-spot-faculty',
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
    MatListModule,
    MatDividerModule,
    MatIconModule,
    DynamicChipListComponent,
  ],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);

  facultySig = input.required<Faculty>();
  adingSubject = false;
  addSubjectControl = this._formBuilder.control('');
  adingGroup = false;
  addGroupControl = this._formBuilder.control('');

  onAddSubject(): void {
    this.adingSubject = false;
  }

  onAddGroup(): void {
    this.adingGroup = false;
  }
}

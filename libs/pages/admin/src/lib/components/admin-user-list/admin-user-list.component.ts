import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'free-spot-admin-user-list',
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
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserListComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  admminUserList: string[] = ['enoh', 'dsada', 'dsggggg', 'bbbbbbbb', 'ffffffff', 'zzzzzzz'];

  addAdminForm = this._formBuilder.control('');

  adingAdmin = false;

  onAddAdmin(): void {
    this.adingAdmin = false;
  }
}

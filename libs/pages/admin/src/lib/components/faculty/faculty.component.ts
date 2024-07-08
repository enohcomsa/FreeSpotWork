import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faculty } from '@free-spot/models';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicChipListComponent } from '@free-spot/ui';

@Component({
  selector: 'free-spot-faculty',
  standalone: true,
  imports: [CommonModule, MatListModule, MatDividerModule, DynamicChipListComponent],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyComponent {
  facultySig = input.required<Faculty>();
}

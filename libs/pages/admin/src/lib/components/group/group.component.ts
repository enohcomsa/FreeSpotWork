import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-free-spot-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './free-spot-group.component.html',
  styleUrl: './free-spot-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotGroupComponent {}

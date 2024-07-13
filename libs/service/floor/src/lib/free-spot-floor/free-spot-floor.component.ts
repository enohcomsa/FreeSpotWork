import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-free-spot-floor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './free-spot-floor.component.html',
  styleUrl: './free-spot-floor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotFloorComponent {}

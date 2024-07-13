import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-free-spot-building',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './free-spot-building.component.html',
  styleUrl: './free-spot-building.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotBuildingComponent {}

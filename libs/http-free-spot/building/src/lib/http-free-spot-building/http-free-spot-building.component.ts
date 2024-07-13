import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-http-free-spot-building',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './http-free-spot-building.component.html',
  styleUrl: './http-free-spot-building.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpFreeSpotBuildingComponent {}

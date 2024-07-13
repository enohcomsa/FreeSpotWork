import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-http-free-spot-floor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './http-free-spot-floor.component.html',
  styleUrl: './http-free-spot-floor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpFreeSpotFloorComponent {}

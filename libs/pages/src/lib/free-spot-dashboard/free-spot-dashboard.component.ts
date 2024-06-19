import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './free-spot-dashboard.component.html',
  styleUrl: './free-spot-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotDashboardComponent {}

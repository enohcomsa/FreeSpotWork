import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-admin-floor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-floor-card.component.html',
  styleUrl: './admin-floor-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorCardComponent {}

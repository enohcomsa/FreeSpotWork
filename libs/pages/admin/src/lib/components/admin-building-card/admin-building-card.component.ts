import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-admin-building-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-building-card.component.html',
  styleUrl: './admin-building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingCardComponent {}

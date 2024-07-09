import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-admin-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventCardComponent {}

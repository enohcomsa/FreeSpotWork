import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-admin-room-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-room-card.component.html',
  styleUrl: './admin-room-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomCardComponent {}

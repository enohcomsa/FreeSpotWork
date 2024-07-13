import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-free-spot-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './free-spot-event.component.html',
  styleUrl: './free-spot-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotEventComponent {}

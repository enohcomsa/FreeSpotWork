import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'free-spot-http-free-spot-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './http-free-spot-event.component.html',
  styleUrl: './http-free-spot-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpFreeSpotEventComponent {}

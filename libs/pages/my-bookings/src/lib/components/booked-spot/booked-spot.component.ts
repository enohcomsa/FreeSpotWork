import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BookedEvent } from '@free-spot/models';
import { Event } from '@free-spot/enums';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-booked-spot',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, TranslateModule],
  templateUrl: './booked-spot.component.html',
  styleUrl: './booked-spot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedSpotComponent {
  eventSig = input.required<BookedEvent>();
  deleteEvent = output<BookedEvent>();

  EVENT = Event;
}

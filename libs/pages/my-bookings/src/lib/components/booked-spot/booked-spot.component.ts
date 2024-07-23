import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BookedEvent } from '@free-spot/models';
import { Event } from '@free-spot/enums';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-booked-spot',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './booked-spot.component.html',
  styleUrl: './booked-spot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedSpotComponent {
  EVENT = Event;
  event_learn: BookedEvent = {
    activityType: Event.LABORATORY,
    subjectItem: {
      name: 'Sist. optoelectronice in telecomunicatii ',
      shortName: 'SOT',
    },
    date: new Date('2024-7-15'),
    startHour: 8,
    endHour: 10,
    buildingName: 'Laboratoare Observatorrrrrrrrrrrrrrrrr',
    floorName: '5th',
    roomName: '519',
  };
  event_special: BookedEvent = {
    activityType: Event.SPECIAL_EVENT,
    subjectItem: {
      name: 'Sist. optoelectronice in telecomunicatii ',
      shortName: 'SOT',
    },
    date: new Date('2024-7-15'),
    startHour: 14,
    endHour: 16,
    buildingName: 'Baritiu corp A',
    floorName: '1st',
    roomName: '329',
  };
  event = this.event_learn;
}

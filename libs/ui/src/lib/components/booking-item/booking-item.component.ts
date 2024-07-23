import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BookedEvent } from '@free-spot/models';
import { Event } from '@free-spot/enums';

@Component({
  selector: 'free-spot-booking-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingItemComponent {
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
}

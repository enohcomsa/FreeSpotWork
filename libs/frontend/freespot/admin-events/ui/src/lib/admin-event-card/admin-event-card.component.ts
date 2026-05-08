import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import {
  AdminEventsBuilding,
  AdminEventsRoom,
  AdminSpecialEvent,
} from '@free-spot/admin-events/domain';

@Component({
  selector: 'free-spot-admin-event-card',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventCardComponent {
  adminEventSig = input.required<AdminSpecialEvent>();
  adminEventBuildingSig = input.required<AdminEventsBuilding>();
  adminEventRoomSig = input.required<AdminEventsRoom>();
  addingEventSig = model.required<boolean>();
  editEvent = output<AdminSpecialEvent>();
  deleteEvent = output<AdminSpecialEvent>();

  getRoomFreeSpots(): number {
    return this.adminEventRoomSig().totalSpotsNumber - this.adminEventRoomSig().unavailableSpots - this.adminEventSig().reservedSpots;
  }

  getRoomBookedSports(): number {
    //TO DO: implement after booking service
    return 0;
  }
}

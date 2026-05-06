import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SpecialEvent } from '@free-spot-domain/event';
import { Building } from '@free-spot-domain/building';
import { Room } from '@free-spot-domain/room';

@Component({
  selector: 'free-spot-admin-event-card',

  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventCardComponent {
  adminEventSig = input.required<SpecialEvent>();
  adminEventBuildingSig = input.required<Building>();
  adminEventRoomSig = input.required<Room>();
  addingEventSig = model.required<boolean>();
  editEvent = output<SpecialEvent>();
  deleteEvent = output<SpecialEvent>();


  getRoomFreeSpots(): number {
    return this.adminEventRoomSig().totalSpotsNumber - this.adminEventRoomSig().unavailableSpots - this.adminEventSig().reservedSpots;
  }

  getRoomBookedSports(): number {
    //TO DO: implement after booking service
    return 0;
  }
}

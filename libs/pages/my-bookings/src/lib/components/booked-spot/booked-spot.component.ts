import { ChangeDetectionStrategy, Component, computed, inject, input, output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { Booking } from '@free-spot-domain/booking';
import { ActivityType } from '@free-spot/enums';
import { SubjectService } from '@free-spot-service/subject';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { SubjectItem } from '@free-spot-domain/subject';
import { Room } from '@free-spot-domain/room';
import { Building } from '@free-spot-domain/building';
import { Floor } from '@free-spot-domain/floor';
import { TimetableActivity } from '@free-spot-domain/timetable-activity';

@Component({
  selector: 'free-spot-booked-spot',
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, TranslateModule],
  templateUrl: './booked-spot.component.html',
  styleUrl: './booked-spot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedSpotComponent {
  private readonly _subjectService = inject(SubjectService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _buildingService = inject(BuildingService);
  private readonly _floorService = inject(AdminFloorService);
  private readonly _timetableActivityService = inject(AdminTimetableActivityService);

  bookingSig = input.required<Booking>();
  selectedSig = input<boolean>(false);

  bookingSelected = output<string>();
  deleteBooking = output<string>();

  ACTIVITY_TYPE = ActivityType;

  activitySig: Signal<TimetableActivity> = computed(() => {
    const activityId = this.bookingSig().activityId;
    return activityId ? this._timetableActivityService.getSignalById(activityId)() : ({} as TimetableActivity);
  });

  subjectSig: Signal<SubjectItem> = computed(() => {
    const subjectId = this.bookingSig().subjectId;
    return subjectId ? this._subjectService.getSignalById(subjectId)() : ({} as SubjectItem);
  });

  roomSig: Signal<Room> = computed(() => {
    const roomId = this.activitySig().roomId;
    return roomId ? this._roomService.getSignalById(roomId)() : ({} as Room);
  });

  buildingSig: Signal<Building> = computed(() => {
    const room = this.roomSig();
    return room?.buildingId ? this._buildingService.getSignalById(room.buildingId)() : ({} as Building);
  });

  floorSig: Signal<Floor> = computed(() => {
    const room = this.roomSig();
    return room?.floorId ? this._floorService.getSignalById(room.floorId)() : ({} as Floor);
  });

  selectBooking(): void {
    if (this.bookingSig().activityType === ActivityType.SPECIAL_EVENT) {
      return;
    }

    this.bookingSelected.emit(this.bookingSig().id);
  }

  removeBooking(): void {
    this.deleteBooking.emit(this.bookingSig().id);
  }
}

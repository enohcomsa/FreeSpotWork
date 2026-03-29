import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

import { TimetableActivity } from '@free-spot-domain/timetable-activity';
import { BookingService } from '@free-spot-service/booking';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { SubjectService } from '@free-spot-service/subject';
import { Room } from '@free-spot-domain/room';
import { Building } from '@free-spot-domain/building';
import { Floor } from '@free-spot-domain/floor';
import { SubjectItem } from '@free-spot-domain/subject';

@Component({
  selector: 'free-spot-booking-item',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule, TranslateModule],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingItemComponent {
  private readonly _bookingService = inject(BookingService);
  private readonly _confirmService = inject(ConfirmModalService);
  private readonly _toastrService = inject(ToastrService);

  private readonly _roomService = inject(AdminRoomService);
  private readonly _buildingService = inject(BuildingService);
  private readonly _floorService = inject(AdminFloorService);
  private readonly _subjectService = inject(SubjectService);

  timetableActivitySig: InputSignal<TimetableActivity> = input.required<TimetableActivity>();
  oldTimetableActivitySig: InputSignal<TimetableActivity> = input.required<TimetableActivity>();
  bookingIdSig: InputSignal<string> = input.required<string>();

  bookingActive = output<boolean>();

  subjectSig: Signal<SubjectItem> = computed(() => {
    const subjectId = this.timetableActivitySig().subjectId;
    return subjectId ? this._subjectService.getSignalById(subjectId)() : ({} as SubjectItem);
  });

  roomSig: Signal<Room> = computed(() => {
    const roomId = this.timetableActivitySig().roomId;
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

  bookSpot(): void {
    const bookingId = this.bookingIdSig();
    const targetActivityId = this.timetableActivitySig().id;

    if (!bookingId || !targetActivityId) {
      return;
    }

    this._confirmService
      .openConfirmDialog('Are you sure you want to reschedule this booking? The old booking slot will be lost.')
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (!result) {
          return;
        }

        this._bookingService.reschedule(bookingId, {
          activityId: targetActivityId,
        });

        this._toastrService.success('Booking successfully rescheduled', '', {
          closeButton: true,
          progressBar: true,
          timeOut: 5000,
          onActivateTick: true,
          positionClass: 'toast-bottom-center',
        });

        this.bookingActive.emit(false);
      });
  }
}

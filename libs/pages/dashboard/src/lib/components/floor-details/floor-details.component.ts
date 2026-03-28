import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FloorBookingDrawerComponent } from '../floor-booking-drawer/floor-booking-drawer.component';
import { RoomCardComponent } from '../room-card/room-card.component';
import { AdminFloorService } from '@free-spot-service/floor';
import { TranslateModule } from '@ngx-translate/core';
import { Floor } from '@free-spot-domain/floor';
import { AdminRoomService } from '@free-spot-service/room';
import { Room } from '@free-spot-domain/room';

@Component({
  selector: 'free-spot-floor-details',

  imports: [FloorBookingDrawerComponent, RoomCardComponent, TranslateModule],
  templateUrl: './floor-details.component.html',
  styleUrl: './floor-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorDetailsComponent implements OnInit {
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);

  floorNameSig = input.required<string>();
  toggleStateSig: WritableSignal<boolean> = signal(false);
  floorSig: Signal<Floor> = computed(() => this._adminFloorService.floorListSig().find((floor: Floor) => floor.name === this.floorNameSig()) ?? {} as Floor);
  roomListSig: Signal<Room[]> = computed(() => this._adminRoomService.selectRoomsByFloorId(this.floorSig().id)());
  roomBookingSearchSig = signal<string>('');

  ngOnInit(): void {
    this._adminFloorService.init();
    this._adminRoomService.init();
  }
}

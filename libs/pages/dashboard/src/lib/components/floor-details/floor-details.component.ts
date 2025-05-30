import { ChangeDetectionStrategy, Component, inject, input, OnInit, Signal, signal, WritableSignal } from '@angular/core';

import { FloorBookingDrawerComponent } from '../floor-booking-drawer/floor-booking-drawer.component';
import { Floor } from '@free-spot/models';
import { FloorRoomComponent } from '../floor-room/floor-room.component';
import { AdminFloorService } from '@free-spot-service/floor';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-floor-details',

  imports: [FloorBookingDrawerComponent, FloorRoomComponent, TranslateModule],
  templateUrl: './floor-details.component.html',
  styleUrl: './floor-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorDetailsComponent implements OnInit {
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);

  floorNameSig = input.required<string>();
  toggleStateSig: WritableSignal<boolean> = signal(false);
  floorSig: Signal<Floor> = signal({} as Floor);
  roomBookingSearchSig = signal<string>('');

  ngOnInit(): void {
    this._adminFloorService.init();
    this.floorSig = this._adminFloorService.getFloorByName(this.floorNameSig());
  }
}

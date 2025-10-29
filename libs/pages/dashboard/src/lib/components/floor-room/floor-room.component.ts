import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { RoomLegacy } from '@free-spot/models';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-floor-room',

  imports: [MatCardModule, MatChipsModule, MatButtonModule, TranslateModule],
  templateUrl: './floor-room.component.html',
  styleUrl: './floor-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorRoomComponent {
  roomDataSig = input.required<RoomLegacy>();
  buildingNameSig = input.required<string>();
  toggleStateSig = model.required<boolean>();
  roomBookingSearchSig = output<string>();

  toggleDrawer(roomName: string): void {
    this.toggleStateSig.set(!this.toggleStateSig());
    this.roomBookingSearchSig.emit(roomName);
  }
}

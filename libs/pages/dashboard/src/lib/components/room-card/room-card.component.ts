import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Room } from '@free-spot-domain/room';

@Component({
  selector: 'free-spot-room-card',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, TranslateModule],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCardComponent {
  roomDataSig = input.required<Room>();
  buildingNameSig = input.required<string>();
  toggleStateSig = model.required<boolean>();
  roomBookingSearchSig = output<string>();

  toggleDrawer(roomName: string): void {
    this.toggleStateSig.set(!this.toggleStateSig());
    this.roomBookingSearchSig.emit(roomName);
  }
}

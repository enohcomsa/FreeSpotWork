import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Room } from '@free-spot/models';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-floor-room',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './floor-room.component.html',
  styleUrl: './floor-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorRoomComponent {
  roomDataSig = input.required<Room>();
  buildingNameSig = input.required<string>();
  toggleStateSig = model.required<boolean>();

  toggleDrawer(): void {
    this.toggleStateSig.set(!this.toggleStateSig());
  }
}

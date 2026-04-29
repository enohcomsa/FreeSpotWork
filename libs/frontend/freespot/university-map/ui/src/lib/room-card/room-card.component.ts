import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RoomCardVm } from '@free-spot/university-map/domain';

@Component({
  selector: 'free-spot-room-card',
  imports: [MatCardModule],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCardComponent {
  readonly roomCardVm = input.required<RoomCardVm>();
}

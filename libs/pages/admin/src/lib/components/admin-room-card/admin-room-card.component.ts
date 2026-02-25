import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RoomCardVM } from '@free-spot-presentation/room';

@Component({
  selector: 'free-spot-admin-room-card',

  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './admin-room-card.component.html',
  styleUrl: './admin-room-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  adminRoomSig = input.required<RoomCardVM>();
  addingRoomSig = model.required<boolean>();
  editRoom = output<RoomCardVM>();
  deleteRoom = output<RoomCardVM>();

  onOpenClick(): void {
    this._router.navigate([this.adminRoomSig().id], { relativeTo: this._activatedRoute });
  }
}

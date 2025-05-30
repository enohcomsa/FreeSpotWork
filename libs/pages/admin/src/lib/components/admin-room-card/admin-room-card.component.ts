import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Room } from '@free-spot/models';
import { MatDividerModule } from '@angular/material/divider';

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

  adminRoomSig = input.required<Room>();
  addingRoomSig = model.required<boolean>();
  editRoom = output<Room>();
  deleteRoom = output<Room>();

  onOpenClick(): void {
    this._router.navigate([this.adminRoomSig().name], { relativeTo: this._activatedRoute });
  }
}

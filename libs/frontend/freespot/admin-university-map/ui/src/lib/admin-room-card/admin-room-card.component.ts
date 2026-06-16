import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AdminUniversityMapRoomVm } from './admin-room-card.vm';

@Component({
  selector: 'free-spot-admin-room-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './admin-room-card.component.html',
  styleUrl: './admin-room-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomCardComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  adminRoomSig = input.required<AdminUniversityMapRoomVm>();
  addingRoomSig = model.required<boolean>();
  editRoom = output<AdminUniversityMapRoomVm>();
  deleteRoom = output<AdminUniversityMapRoomVm>();

  onOpenClick(): void {
    this.router.navigate([this.adminRoomSig().id], { relativeTo: this.activatedRoute });
  }
}

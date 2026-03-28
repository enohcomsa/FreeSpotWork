import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Building } from '@free-spot-domain/building';
import { SpecialEvent } from '@free-spot-domain/event';
import { Room } from '@free-spot-domain/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-event-card',
  imports: [CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    TranslateModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  private readonly _buildingService: BuildingService = inject(BuildingService);
  private readonly _roomService: AdminRoomService = inject(AdminRoomService);

  specialEventSig = input.required<SpecialEvent>();
  specialEventBuildingSig: Signal<Building> = computed(() => this._buildingService.getSignalById(this.specialEventSig().buildingId)());
  specialEventRoomSig: Signal<Room> = computed(() => this._roomService.getSignalById(this.specialEventSig().roomId)());
  specialEventFreeSpots: Signal<number> = computed(() =>
    this.specialEventRoomSig().totalSpotsNumber - this.specialEventRoomSig().unavailableSpots - this.specialEventSig().reservedSpots);
}

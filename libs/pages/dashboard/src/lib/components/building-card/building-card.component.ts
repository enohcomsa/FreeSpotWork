import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Building, Floor } from '@free-spot/models';

@Component({
  selector: 'free-spot-building-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './building-card.component.html',
  styleUrl: './building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  floorExp: Floor = {
    name: 'UTCN Obs ground Floor',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 120,
    freeSpots: 90,
    busySpots: 20,
    unavailableSpots: 10,
  };
  floorExp2: Floor = {
    name: '328',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 90,
    freeSpots: 50,
    busySpots: 30,
    unavailableSpots: 10,
  };
  cardData: Building = {
    name: 'Laboratoare Observator',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp, this.floorExp2],
    specialEvent: false,
  };
  eventData: Building = {
    name: 'Simpozion',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp2],
    specialEvent: true,
    building: 'Laboratoare Observator',
    date: new Date('2024-08-14,16:30'),
  };

  onFloorClick(florName: string): void {
    this._router.navigate(['floor/' + florName], { relativeTo: this._activatedRoute });
  }
}

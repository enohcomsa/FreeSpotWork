import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Building } from '@free-spot/models';

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

  buildingSig = input.required<Building>();
  eventData: Building = {
    name: 'Simpozion',
    adress: 'Observatorului, 400347',
    floorList: [
      {
        name: '328',
        buildingName: 'Laboratoare Observator',
        roomList: [],
        totalSpotsNumber: 90,
        unavailableSpots: 10,
      },
    ],
    specialEvent: true,
    building: 'Laboratoare Observator',
    date: new Date('2024-08-14,16:30'),
  };

  onFloorClick(florName: string): void {
    this._router.navigate(['floor/' + florName], { relativeTo: this._activatedRoute });
  }
}

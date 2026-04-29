import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UniversityMapStore } from '@free-spot/university-map/data-access';
import { BuildingCardComponent } from '@free-spot/university-map/ui';

@Component({
  selector: 'free-spot-university-map',
  imports: [CommonModule, TranslateModule, BuildingCardComponent],
  templateUrl: './university-map.component.html',
  styleUrl: './university-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UniversityMapStore],
})
export class UniversityMapComponent implements OnInit {
  private readonly store = inject(UniversityMapStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly buildingCardsSig = this.store.buildingCardsSig;

  ngOnInit(): void {
    this.store.init();
  }

  onFloorClick(event: { buildingId: string; floorName: string }): void {
    this.router.navigate(
      ['building', event.buildingId, 'floor', event.floorName],
      { relativeTo: this.activatedRoute }
    );
  }
}

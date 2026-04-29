import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UniversityMapStore } from '@free-spot/university-map/data-access';
import { RoomCardComponent } from '@free-spot/university-map/ui';

@Component({
  selector: 'free-spot-floor-details',
  imports: [RoomCardComponent, TranslateModule],
  templateUrl: './floor-details.component.html',
  styleUrl: './floor-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UniversityMapStore],
})
export class FloorDetailsComponent implements OnInit {
  private readonly store = inject(UniversityMapStore);

  readonly buildingId = input.required<string>();
  readonly floorName = input.required<string>();

  readonly buildingSig = computed(() => this.store.getBuildingById(this.buildingId()));

  readonly roomListSig = computed(() =>
    this.store.getRoomCardVmsByFloorName(this.floorName())
  );

  ngOnInit(): void {
    this.store.init();
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { AdminBuildingService } from '@free-spot-service/building';
import { Building } from '@free-spot/models';

@Component({
  selector: 'free-spot-dashboard',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent, DynamicFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;

  ngOnInit(): void {
    this._adminBuildingService.init();
  }
}

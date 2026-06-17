import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BuildingCardVm } from './building-card.vm';

@Component({
  selector: 'free-spot-building-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './building-card.component.html',
  styleUrl: './building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingCardComponent {
  readonly buildingCardVm = input.required<BuildingCardVm>();

  readonly floorClicked = output<{ buildingId: string; floorName: string }>();

  onFloorClick(floorName: string): void {
    this.floorClicked.emit({
      buildingId: this.buildingCardVm().id,
      floorName,
    });
  }
}

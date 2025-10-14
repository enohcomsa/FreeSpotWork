import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BuildingLegacy } from '@free-spot/models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-building-card',

  imports: [
    CommonModule,
    RouterModule,
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
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  buildingSig = input.required<BuildingLegacy>();

  onFloorClick(florName: string): void {
    this._router.navigate(['floor/' + florName], { relativeTo: this._activatedRoute });
  }
}

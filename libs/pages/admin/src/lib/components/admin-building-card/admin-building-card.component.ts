import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BuildingCardVM } from '@free-spot-presentation/building';

@Component({
  selector: 'free-spot-admin-building-card',

  imports: [MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './admin-building-card.component.html',
  styleUrl: './admin-building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  adminBuildingSig = input.required<BuildingCardVM>();
  addingBuildingSig = model.required<boolean>();
  editBuilding = output<BuildingCardVM>();
  deleteBuilding = output<BuildingCardVM>();

  onOpenClick(): void {
    this._router.navigate(['building/' + this.adminBuildingSig().id], { relativeTo: this._activatedRoute });
  }
}

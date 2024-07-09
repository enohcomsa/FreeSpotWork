import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Building } from '@free-spot/models';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-admin-building-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-building-card.component.html',
  styleUrl: './admin-building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  adminBuildingSig = input.required<Building>();
  addingBuildingSig = model.required<boolean>();
  editBuilding = output<boolean>();

  onOpenClick(): void {
    this._router.navigate(['building/' + this.adminBuildingSig().name], { relativeTo: this._activatedRoute });
  }
}

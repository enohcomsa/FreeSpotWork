import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FloorCardVM } from '@free-spot-presentation/floor';

@Component({
  selector: 'free-spot-admin-floor-card',

  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatTooltipModule],
  templateUrl: './admin-floor-card.component.html',
  styleUrl: './admin-floor-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  adminFloorSig = input.required<FloorCardVM>();
  addingFloorSig = model.required<boolean>();
  editFloor = output<FloorCardVM>();
  deleteFloor = output<FloorCardVM>();

  onOpenClick(): void {
    this._router.navigate([this.adminFloorSig().id], { relativeTo: this._activatedRoute });
  }
}

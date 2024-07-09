import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Floor } from '@free-spot/models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'free-spot-admin-floor-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-floor-card.component.html',
  styleUrl: './admin-floor-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorCardComponent {
  private _router: Router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  adminFloorSig = input.required<Floor>();

  addingFloorSig = model.required<boolean>();
  editFloor = output<boolean>();

  onOpenClick(): void {
    this._router.navigate([this.adminFloorSig().name], { relativeTo: this._activatedRoute });
  }
}

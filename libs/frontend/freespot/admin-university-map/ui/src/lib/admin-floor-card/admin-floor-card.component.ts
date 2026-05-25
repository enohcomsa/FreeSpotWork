import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminUniversityMapFloorVM } from '@free-spot/admin-university-map/domain';

@Component({
  selector: 'free-spot-admin-floor-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatTooltipModule],
  templateUrl: './admin-floor-card.component.html',
  styleUrl: './admin-floor-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorCardComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  adminFloorSig = input.required<AdminUniversityMapFloorVM>();
  addingFloorSig = model.required<boolean>();
  editFloor = output<AdminUniversityMapFloorVM>();
  deleteFloor = output<AdminUniversityMapFloorVM>();

  onOpenClick(): void {
    this.router.navigate([this.adminFloorSig().id], { relativeTo: this.activatedRoute });
  }
}

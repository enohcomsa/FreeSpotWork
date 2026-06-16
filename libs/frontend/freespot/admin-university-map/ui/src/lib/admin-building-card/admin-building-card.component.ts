import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { type AdminUniversityMapBuildingCardVm } from './admin-building-card.vm';

@Component({
  selector: 'free-spot-admin-building-card',
  imports: [MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './admin-building-card.component.html',
  styleUrl: './admin-building-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingCardComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly adminBuildingSig = input.required<AdminUniversityMapBuildingCardVm>();
  readonly addingBuildingSig = model.required<boolean>();
  readonly editBuilding = output<AdminUniversityMapBuildingCardVm>();
  readonly deleteBuilding = output<AdminUniversityMapBuildingCardVm>();

  onOpenClick(): void {
    this.router.navigate(['building/' + this.adminBuildingSig().id], { relativeTo: this.activatedRoute });
  }
}

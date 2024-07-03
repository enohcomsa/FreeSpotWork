import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';

@Component({
  selector: 'free-spot-dashboard',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent, DynamicFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}

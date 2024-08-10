import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Building } from '@free-spot/models';

@Component({
  selector: 'free-spot-admin-event-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventCardComponent {
  adminEventSig = input.required<Building>();
  addingEventSig = model.required<boolean>();
  editEvent = output<Building>();
  deleteEvent = output<Building>();
}

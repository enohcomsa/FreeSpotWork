import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AdminEventCardVm } from './admin-event-card.vm';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-admin-event-card',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatIconModule, MatButtonModule,TranslateModule],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventCardComponent {
  adminEventSig = input.required<AdminEventCardVm>();
  addingEventSig = model.required<boolean>();

  editEvent = output<string>();
  deleteEvent = output<string>();
}

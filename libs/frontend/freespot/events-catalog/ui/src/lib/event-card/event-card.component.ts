import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { EventCardVm } from './events-catalog.vm';

@Component({
  selector: 'free-spot-event-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  readonly eventCardVm = input.required<EventCardVm>();

  readonly registerClicked = output<string>();

  onRegister(): void {
    if (this.eventCardVm().isRegistered) {
      return;
    }

    this.registerClicked.emit(this.eventCardVm().id);
  }
}

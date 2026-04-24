import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RescheduleOptionCardVm } from '../reschedule-option-card.model';

@Component({
  selector: 'free-spot-reschedule-option-card',
  imports: [DatePipe, MatButtonModule, TranslateModule],
  templateUrl: './reschedule-option-card.component.html',
  styleUrl: './reschedule-option-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RescheduleOptionCardComponent {
  vm = input.required<RescheduleOptionCardVm>();
  book = output<string>();

  onBook(): void {
    this.book.emit(this.vm().id);
  }
}

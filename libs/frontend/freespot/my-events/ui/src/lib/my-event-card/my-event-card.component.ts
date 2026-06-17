import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MyEventCardVm } from './my-event-card.vm';

@Component({
  selector: 'free-spot-my-event-card',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, TranslateModule],
  templateUrl: './my-event-card.component.html',
  styleUrl: './my-event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventCardComponent {
  vm = input.required<MyEventCardVm>();
  remove = output<string>();

  onRemove(): void {
    this.remove.emit(this.vm().id);
  }
}

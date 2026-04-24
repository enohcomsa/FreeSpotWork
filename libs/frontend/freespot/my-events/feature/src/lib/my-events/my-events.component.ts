import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MyEventsStore } from '@free-spot/my-events/data-access';
import { MyEventCardComponent } from '@free-spot/my-events/ui';

@Component({
  selector: 'free-spot-my-events',
  imports: [TranslateModule, MyEventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventsComponent implements OnInit {
  private readonly store = inject(MyEventsStore);

  readonly events = this.store.eventCards;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  ngOnInit(): void {
    this.store.load();
  }

  remove(id: string): void {
    this.store.remove(id);
  }
}

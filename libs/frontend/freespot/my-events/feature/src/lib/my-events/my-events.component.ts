import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MyEventsStore } from '@free-spot/my-events/data-access';
import { MyEventCardComponent, MyEventCardVm } from '@free-spot/my-events/ui';
import { mapToMyEventVm } from './my-event.mapper';

@Component({
  selector: 'free-spot-my-events',
  imports: [TranslateModule, MyEventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventsComponent implements OnInit {
  private readonly store = inject(MyEventsStore);

  readonly events = computed<MyEventCardVm[]>(() =>
    this.store.bookedEvents().map((item) =>
      mapToMyEventVm(
        item.booking,
        item.event,
        item.building,
        item.floor,
        item.room,
      ),
    ),
  );
  ngOnInit(): void {
    this.store.load();
  }

  remove(id: string): void {
    this.store.remove(id);
  }
}

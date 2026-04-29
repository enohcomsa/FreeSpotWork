import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EventCardComponent } from '@free-spot/events-catalog/ui';
import { EventsCatalogStore } from '@free-spot/events-catalog/data-access';
import { EventRegistrationStore } from '@free-spot/event-registration/data-access';

@Component({
  selector: 'free-spot-events-catalog',
  imports: [EventCardComponent, TranslateModule],
  templateUrl: './events-catalog.component.html',
  styleUrl: './events-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventsCatalogStore],
})
export class EventsCatalogComponent implements OnInit {
  readonly store = inject(EventsCatalogStore);

  private readonly _eventRegistrationStore = inject(EventRegistrationStore);

  readonly eventCardVmsSig = this.store.futureEventCardVmsSig;

  ngOnInit(): void {
    this.store.init();
  }

  onRegister(eventId: string): void {
    this._eventRegistrationStore.register(eventId);
  }
}

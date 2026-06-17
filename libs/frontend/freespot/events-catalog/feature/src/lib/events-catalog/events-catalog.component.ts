import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EventCardComponent, EventCardVm } from '@free-spot/events-catalog/ui';
import { EventsCatalogStore } from '@free-spot/events-catalog/data-access';
import { ConfirmModalService } from '@free-spot/shared/ui';
import { filter, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toEventCardVm } from './event-card.vm.mapper';

@Component({
  selector: 'free-spot-events-catalog',
  imports: [EventCardComponent, TranslateModule],
  templateUrl: './events-catalog.component.html',
  styleUrl: './events-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventsCatalogStore],
})
export class EventsCatalogComponent implements OnInit {
  private readonly confirmModalService = inject(ConfirmModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly registerEvent = output<string>();

  readonly store = inject(EventsCatalogStore);

  readonly eventCardVmsSig = computed<EventCardVm[]>(() =>
    this.store
      .futureEventListSig()
      .map((event) =>
        toEventCardVm(
          event,
          this.store.buildingListSig(),
          this.store.roomListSig(),
          this.store.registeredEventIdSetSig(),
        ),
      ),
  );

  ngOnInit(): void {
    this.store.init();
  }

  onRegister(eventId: string): void {
    this.confirmModalService
      .openConfirmDialog('Are you sure you want to register for this event?')
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.registerEvent.emit(eventId);
      });
  }
}

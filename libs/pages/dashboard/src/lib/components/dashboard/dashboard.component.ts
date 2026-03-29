import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BuildingCardComponent } from '../building-card/building-card.component';
import { EventCardComponent } from '../event-card/event-card.component';
import { SpecialEventBookingComponent } from '../special-event-booking/special-event-booking.component';

import { BuildingService } from '@free-spot-service/building';
import { BuildingCardService } from '@free-spot-service/building-card';
import { AdminEventService } from '@free-spot-service/event';
import { AdminRoomService } from '@free-spot-service/room';
import { AppDateService } from '@free-spot-service/app-date';
import { AuthService } from '@free-spot-service/auth';

import { TranslateModule } from '@ngx-translate/core';

import { FreeSpotDate } from '@free-spot/models';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { SpecialEvent } from '@free-spot-domain/event';

@Component({
  selector: 'free-spot-dashboard',
  imports: [BuildingCardComponent, EventCardComponent, SpecialEventBookingComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _dialog = inject(MatDialog);
  private _adminBuildingCardService = inject(BuildingCardService);
  private _adminEventService = inject(AdminEventService);
  private _adminRoomService = inject(AdminRoomService);
  private _adminBuildingService = inject(BuildingService);
  private _appDateService = inject(AppDateService);
  private _authService = inject(AuthService);

  readonly buildingCardVMs: Signal<BuildingCardVM[]> = this._adminBuildingCardService.buildingCardListSig;
  readonly eventListSig: Signal<SpecialEvent[]> = this._adminEventService.eventListSig;
  readonly appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;
  readonly selectedSpecialEventIdSig: WritableSignal<string | null> = signal(null);

  private _setupDialogOpenedSig = signal(false);

  constructor() {
    effect(() => {
      const initialized = this._authService.initializedSignal$();
      const user = this._authService.userSignal$();
      const setupDialogOpened = this._setupDialogOpenedSig();

      if (!initialized || !user || setupDialogOpened) {
        return;
      }

      const isProfileIncomplete =
        !user.firstName ||
        !user.familyName ||
        !user.facultyId ||
        !user.programId ||
        !user.programYearId ||
        !user.groupCohortId;

      if (!isProfileIncomplete) {
        return;
      }

      this._setupDialogOpenedSig.set(true);

      import('../user-setup-dialog/user-setup-dialog.component').then((m) => {
        this._dialog
          .open(m.UserSetupDialogComponent, {
            delayFocusTrap: true,
            disableClose: true,
            panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2','max-h-[75vh]'],
          })
          .afterClosed()
          .subscribe(() => {
            this._setupDialogOpenedSig.set(false);
          });
      });
    });
  }

  ngOnInit(): void {
    this._adminEventService.init();
    this._adminRoomService.init();
    this._adminBuildingCardService.init();
    this._adminBuildingService.init();

    if (!this._authService.initializedSignal$()) {
      this._authService.loadMe().subscribe();
    }
  }

  onSpecialEventSelected(eventId: string): void {
    this.selectedSpecialEventIdSig.set(eventId);
  }
}

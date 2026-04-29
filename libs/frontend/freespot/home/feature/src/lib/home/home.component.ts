import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  UserSetupDialogComponent
} from '@free-spot/dashboard';
import { EventsCatalogComponent } from '@free-spot/events-catalog/feature';
// import { UniversityMapComponent } from '@free-spot/university-map/feature';

import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';
import { AuthService } from '@free-spot-service/auth';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-home',
  imports: [
    EventsCatalogComponent,
    // UniversityMapComponent,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _adminRoomService = inject(AdminRoomService);
  private readonly _adminBuildingService = inject(BuildingService);
  private readonly _authService = inject(AuthService);


  private readonly _setupDialogOpenedSig = signal(false);

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

      this._dialog
        .open(UserSetupDialogComponent, {
          delayFocusTrap: true,
          disableClose: true,
          panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2', 'max-h-[75vh]'],
        })
        .afterClosed()
        .subscribe(() => {
          this._setupDialogOpenedSig.set(false);
        });
    });
  }

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminBuildingService.init();

    if (!this._authService.initializedSignal$()) {
      this._authService.loadMe().subscribe();
    }
  }
}

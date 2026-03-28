import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { BuildingService } from '@free-spot-service/building';
import { FreeSpotDate, FreeSpotUser } from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppDateService } from '@free-spot-service/app-date';
import { AdminRoomService } from '@free-spot-service/room';
import { AdminEventService } from '@free-spot-service/event';
import { TranslateModule } from '@ngx-translate/core';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { BuildingCardService } from '@free-spot-service/building-card';
import { SpecialEvent } from '@free-spot-domain/event';
import { EventCardComponent } from '../event-card/event-card.component';


@Component({
  selector: 'free-spot-dashboard',

  imports: [BuildingCardComponent, EventCardComponent, DynamicFormComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _dialog: MatDialog = inject(MatDialog);
  private _adminBuildingCardService: BuildingCardService = inject(BuildingCardService);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminBuildingService: BuildingService = inject(BuildingService);

  private _userService: UserService = inject(UserService);
  private _appDateService: AppDateService = inject(AppDateService);


  readonly buildingCardVMs: Signal<BuildingCardVM[]> = this._adminBuildingCardService.buildingCardListSig;
  eventListSig: Signal<SpecialEvent[]> = this._adminEventService.eventListSig;

  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;

  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;


  currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;
  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this.currentUserEmail);
  currentUserSubscription: Subscription = toObservable(this.currentUserSig)
    .pipe(
      filter((user: FreeSpotUser) => Object.keys(user).length !== 0),
      take(1),
    )
    .subscribe(async (user: FreeSpotUser) => {
      if ((!user.group && !user.semiGroup) || !user.faculty || !user.currentYear) {
        this._dialog.open(
          await import('../user-setup-dialog/user-setup-dialog.component').then(
            (m) => m.UserSetupDialogComponent
          ), {
          delayFocusTrap: true,
          disableClose: true,
          panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2'],
          data: this.currentUserSig(),
        });
      }
    });

  ngOnInit(): void {
    this._adminEventService.init();
    this._adminRoomService.init();
    this._adminBuildingCardService.init();
    this._adminBuildingService.init();

    // this._userService.init();
  }
}

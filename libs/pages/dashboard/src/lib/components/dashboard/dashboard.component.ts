import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { AdminBuildingService } from '@free-spot-service/building';
import { Building, FreeSpotUser, Group } from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription } from 'rxjs';
import { UserSetupDialogComponent } from '../user-setup-dialog/user-setup-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminFacultyService } from '@free-spot-service/faculty';

@Component({
  selector: 'free-spot-dashboard',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent, DynamicFormComponent, UserSetupDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _dialog: MatDialog = inject(MatDialog);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _userService: UserService = inject(UserService);

  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;
  currentUserGroupSig: Signal<Group> = computed(() =>
    this._adminFacultyService.getGroupByName(this.currentUserSig().group as string)(),
  );

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
    .pipe(filter((user: FreeSpotUser) => Object.keys(user).length !== 0))
    .subscribe((user: FreeSpotUser) => {
      if ((!user.group && !user.semiGroup) || !user.faculty || !user.currentYear) {
        this._dialog.open(UserSetupDialogComponent, {
          delayFocusTrap: true,
          disableClose: true,
          panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2'],
          data: this.currentUserSig(),
        });
      }
    });

  // constructor() {
  //   effect(() => {
  //     console.log(this.currentUserGroupSig());
  //   });
  // }

  ngOnInit(): void {
    this._userService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
  }
}

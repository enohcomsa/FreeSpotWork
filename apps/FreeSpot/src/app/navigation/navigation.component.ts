import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { FreeSpotUser } from '@free-spot/models';
import { Role } from '@free-spot/enums';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'free-spot-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatListModule, MatDividerModule, LoadingComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);

  opened = false;

  Role = Role;
  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;

  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);

  ngOnInit(): void {
    this._appDateService.init();
  }
}

export default NavigationComponent;

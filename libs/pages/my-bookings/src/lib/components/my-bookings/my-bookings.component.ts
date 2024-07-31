import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DynamicFormComponent } from '@free-spot/ui';
import { BookedSpotComponent } from '../booked-spot/booked-spot.component';
import { UserService } from '@free-spot-service/user';
import { FreeSpotUser } from '@free-spot/models';

@Component({
  selector: 'free-spot-my-bookings',
  standalone: true,
  imports: [CommonModule, MatChipsModule, DynamicFormComponent, BookedSpotComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private _userService: UserService = inject(UserService);

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
    this._userService.init();
  }
}

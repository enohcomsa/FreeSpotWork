import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@free-spot-service/auth';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'free-spot-app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'FreeSpot';
  private _authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._authService.autoLogIn();
  }
}


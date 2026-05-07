import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { EventsCatalogComponent } from '@free-spot/events-catalog/feature';
import { UniversityMapComponent } from '@free-spot/university-map/feature';
import { UserSetupFlow } from '@free-spot/user-setup/feature';
import { AuthService } from '@free-spot/core/data-access';

@Component({
  selector: 'free-spot-home',
  imports: [
    UniversityMapComponent,
    EventsCatalogComponent,
  ],
  providers: [UserSetupFlow],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userSetupFlow = inject(UserSetupFlow);

  ngOnInit(): void {
    if (!this.authService.initializedSignal$()) {
      this.authService.loadMe().subscribe();
    }

    this.userSetupFlow.init();
  }
}

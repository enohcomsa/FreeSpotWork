import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@free-spot/core/data-access';
import { EventRegistrationStore } from '@free-spot/event-registration/data-access';
import { EventsCatalogComponent } from '@free-spot/events-catalog/feature';
import { UniversityMapComponent } from '@free-spot/university-map/feature';
import { UserSetupFlow } from '@free-spot/user-setup/feature';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'free-spot-home',
  imports: [UniversityMapComponent, EventsCatalogComponent],
  providers: [UserSetupFlow],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userSetupFlow = inject(UserSetupFlow);
  private readonly eventRegistrationStore = inject(EventRegistrationStore);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    if (!this.authService.initializedSignal()) {
      this.authService.loadMe().subscribe();
    }

    this.userSetupFlow.init();
  }

  onRegisterEvent(eventId: string): void {
    this.eventRegistrationStore.register(eventId).subscribe(() => {
      this.snackBar.open('Successfully registered for event', '', {
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    });
  }
}

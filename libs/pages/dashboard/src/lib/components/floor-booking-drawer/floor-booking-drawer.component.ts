import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DynamicFormComponent } from '@free-spot/ui';
import { Event } from '@free-spot/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'free-spot-floor-booking-drawer',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, DynamicFormComponent, MatButtonModule, MatIconModule],
  templateUrl: './floor-booking-drawer.component.html',
  styleUrl: './floor-booking-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorBookingDrawerComponent {
  toggleStateSig = model.required<boolean>();
  EVENT = Event;
  roomNameSig = input.required<string>();
}

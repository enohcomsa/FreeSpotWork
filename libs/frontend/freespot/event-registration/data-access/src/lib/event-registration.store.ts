import { Injectable, inject } from '@angular/core';
import { type Observable } from 'rxjs';
import { type EventRegistrationBooking } from '@free-spot/event-registration/domain';
import { HttpEventRegistrationService } from './http-event-registration.service';

@Injectable({ providedIn: 'root' })
export class EventRegistrationStore {
  private readonly api = inject(HttpEventRegistrationService);

  register(eventId: string): Observable<EventRegistrationBooking> {
    return this.api.createBooking$(eventId);
  }
}

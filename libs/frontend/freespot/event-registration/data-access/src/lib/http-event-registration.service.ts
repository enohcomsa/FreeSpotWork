import { inject, Injectable } from '@angular/core';
import { BookingsHttpService, type BookingCreateDTO } from '@free-spot/api-client';
import { type EventRegistrationBooking } from '@free-spot/event-registration/domain';
import { map, Observable } from 'rxjs';
import { dtoToEventRegistrationBooking } from './event-registration.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpEventRegistrationService {
  private readonly _api = inject(BookingsHttpService);

  createBooking$(activityId: string): Observable<EventRegistrationBooking> {
    const bookingCreateDTO: BookingCreateDTO = { activityId };

    return this._api.bookingsPost({ bookingCreateDTO }).pipe(map(dtoToEventRegistrationBooking));
  }
}

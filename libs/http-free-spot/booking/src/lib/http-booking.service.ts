import { inject, Injectable } from '@angular/core';
import { BookingsHttpService } from '@free-spot/api-client';
import { Booking, dtoToDomain, RescheduleBookingCmd, toRescheduleUpdateDTO } from '@free-spot-domain/booking';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpBookingService {
  private readonly api = inject(BookingsHttpService);

  getBookingById$(id: string): Observable<Booking> {
    return this.api.bookingsIdGet({ id }).pipe(map(dtoToDomain));
  }

  rescheduleBooking$(id: string, input: RescheduleBookingCmd): Observable<Booking> {
    return this.api
      .bookingsIdPatch({
        id,
        bookingUpdateDTO: toRescheduleUpdateDTO(input),
      })
      .pipe(map(dtoToDomain));
  }

  deleteBooking$(id: string): Observable<void> {
    return this.api.bookingsIdDelete({ id }).pipe(map(() => void 0));
  }
}

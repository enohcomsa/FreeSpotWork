import { inject, Injectable } from '@angular/core';
import { Booking, RescheduleBookingCmd } from '@free-spot-domain/booking';
import { BookingsHttpService, BookingCreateDTO, BookingResponseDTO } from '@free-spot/api-client';
import { dtoToDomain } from './mappers/booking.dto.mapper';
import { map, Observable } from 'rxjs';
import { toRescheduleUpdateDTO } from './mappers/booking.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpBookingService {
  private readonly api = inject(BookingsHttpService);

  listBookings$(): Observable<Booking[]> {
    return this.api.bookingsGet().pipe(
      map((dtos: BookingResponseDTO[]) => (dtos ?? []).map(dtoToDomain))
    );
  }

  getBookingById$(id: string): Observable<Booking> {
    return this.api.bookingsIdGet({ id }).pipe(map(dtoToDomain));
  }

  createBooking$(input: BookingCreateDTO): Observable<Booking> {
    return this.api.bookingsPost({ bookingCreateDTO: input }).pipe(map(dtoToDomain));
  }

  rescheduleBooking$(id: string, input: RescheduleBookingCmd): Observable<Booking> {
    return this.api
      .bookingsIdPatch({
        id,
        bookingRescheduleDTO: toRescheduleUpdateDTO(input),
      })
      .pipe(map(dtoToDomain));
  }

  deleteBooking$(id: string): Observable<void> {
    return this.api.bookingsIdDelete({ id }).pipe(map(() => void 0));
  }
}

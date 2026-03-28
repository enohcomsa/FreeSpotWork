import { inject, Injectable } from '@angular/core';
import { AvailabilityHttpService } from '@free-spot/api-client';
import { RescheduleOptionsResult, rescheduleOptionsDtoToDomain } from '@free-spot-domain/booking';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpAvailabilityService {
  private readonly api = inject(AvailabilityHttpService);

  getRescheduleOptions$(bookingId: string): Observable<RescheduleOptionsResult> {
    return this.api
      .availabilityRescheduleOptionsGet({ bookingId })
      .pipe(map(rescheduleOptionsDtoToDomain));
  }
}

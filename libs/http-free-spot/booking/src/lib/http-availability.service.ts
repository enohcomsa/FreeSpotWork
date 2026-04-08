import { inject, Injectable } from '@angular/core';
import { RescheduleOptionsResult } from '@free-spot-domain/booking';
import { AvailabilityHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { rescheduleOptionsDtoToDomain } from './mappers/availablilty.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAvailabilityService {
  private readonly api = inject(AvailabilityHttpService);

  getRescheduleOptions$(bookingId: string): Observable<RescheduleOptionsResult> {
    return this.api
      .availabilityRescheduleOptionsGet({ bookingId })
      .pipe(map(rescheduleOptionsDtoToDomain));
  }
}

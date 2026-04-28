import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTimetableActivityService } from '@http-free-spot/timetable-activity';
import { TimetableActivity } from '@free-spot/academic-schedule/domain';

@Injectable({
  providedIn: 'root',
})
export class AcademicScheduleTimetableActivityService {
  private readonly _httpTimetableActivityService = inject(HttpTimetableActivityService);

  list$(): Observable<TimetableActivity[]> {
    return this._httpTimetableActivityService.listTimetableActivityItems$();
  }
}

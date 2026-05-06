import { Injectable, Signal, inject } from '@angular/core';
import { Faculty } from '@free-spot-domain/faculty';
import { AdminFacultyService } from '@free-spot-service/faculty';

@Injectable({ providedIn: 'root' })
export class AdminAcademicStructureStore {
  private _adminFacultyService = inject(AdminFacultyService);

  readonly facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;

  init(): void {
    this._adminFacultyService.init();
  }
}

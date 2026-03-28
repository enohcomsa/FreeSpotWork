import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { CreateFacultyCmd, Faculty, UpdateFacultyCmd } from '@free-spot-domain/faculty';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFacultyService } from '@http-free-spot/faculty';
import { Observable, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AdminFacultyService {
  private _httpFacultyService: HttpFacultyService = inject(HttpFacultyService);
  private readonly _destroyRef = inject(DestroyRef);


  private _facultyListSig: WritableSignal<Faculty[]> = signal([]);


  facultyListSig = this._facultyListSig.asReadonly();

  init(): void {
    if (!this._facultyListSig().length) {
      this._httpFacultyService
        .listFaculties$()
        .pipe(take(1))
        .subscribe((facultyList: Faculty[]) => {
          this._facultyListSig.set(facultyList);
        });
    }
  }

  getSignalById(id: string): Signal<Faculty> {
    return computed(() => this.facultyListSig().find((faculty: Faculty) => faculty.id === id) || ({} as Faculty))
  }

  getById(id: string): Observable<Faculty> {
    return this._httpFacultyService.getFacultyById$(id);
  }

  create(input: CreateFacultyCmd): void {
    this._httpFacultyService.createFaculty$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._facultyListSig));
  }

  update(id: string, patch: UpdateFacultyCmd): void {
    this._httpFacultyService.updateFaculty$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._facultyListSig));
  }

  remove(id: string): void {
    this._httpFacultyService.deleteFaculty$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._facultyListSig));
  }
}

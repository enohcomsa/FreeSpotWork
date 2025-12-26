import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Cohort, CreateCohortCmd, UpdateCohortCmd } from '@free-spot-domain/cohort';
import { HttpCohortService } from '@http-free-spot/cohort';
import { take, Observable } from 'rxjs';
import { SignalArrayUtil } from '@free-spot/util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CohortService {
  private _httpCohortService: HttpCohortService = inject(HttpCohortService);
  private readonly _destroyRef = inject(DestroyRef);

  private _cohortListSig: WritableSignal<Cohort[]> = signal([]);
  cohortListSig = this._cohortListSig.asReadonly();

  private _loading = false;
  private _loaded = false;

  init(): void {
    if (this._loaded || this._loading) {
      return;
    }

    if (this._cohortListSig().length) {
      this._loaded = true;
      return;
    }

    this._loading = true;
    if (!this._cohortListSig().length) {
      this._httpCohortService
        .listCohorts$()
        .pipe(take(1))
        .subscribe({
          next: (cohortList: Cohort[]) => {
            this._cohortListSig.set(cohortList);
          },
          error: (err) => {
            console.error('Failed to load subject list', err);
            this._loading = false;
          },
          complete: () => {
            this._loading = false;
          },
        });
    }
  }

  selectCohortsByProgramYearId(programYearId: string): Signal<Cohort[]> {
    return computed(() => this.cohortListSig().filter((cohort: Cohort) => cohort.programYearId === programYearId));
  }

  getSignalById(id: string): Signal<Cohort> {
    return computed(() => this.cohortListSig().find((cohort: Cohort) => cohort.id === id) || ({} as Cohort));
  }

  getById(id: string): Observable<Cohort> {
    return this._httpCohortService.getCohortById$(id);
  }

  create(input: CreateCohortCmd): void {
    this._httpCohortService.createCohort$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._cohortListSig));
  }

  update(id: string, patch: UpdateCohortCmd): void {
    this._httpCohortService.updateCohort$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._cohortListSig));
  }

  remove(id: string): void {
    this._httpCohortService.deleteCohort$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._cohortListSig));
  }
}

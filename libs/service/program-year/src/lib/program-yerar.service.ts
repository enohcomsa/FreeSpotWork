import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateProgramYearCmd, ProgramYear, UpdateProgramYearCmd } from '@free-spot-domain/program-year';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpProgramYearService } from '@http-free-spot/program-year';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramYerarService {
  private _httpProgramYearService: HttpProgramYearService = inject(HttpProgramYearService);
  private readonly _destroyRef = inject(DestroyRef);

  private _programYearListSig: WritableSignal<ProgramYear[]> = signal([]);
  programYearListSig = this._programYearListSig.asReadonly();

  private _loading = false;
  private _loaded = false;

  init(): void {
    if (this._loaded || this._loading) {
      return;
    }

    if (this._programYearListSig().length) {
      this._loaded = true;
      return;
    }

    this._loading = true;
    if (!this._programYearListSig().length) {
      this._httpProgramYearService
        .listProgramYears$()
        .pipe(take(1))
        .subscribe({
          next: (programYearList: ProgramYear[]) => {
            this._programYearListSig.set(programYearList);
          },
          error: (err) => {
            console.error('Failed to load programYear list', err);
            this._loading = false;
          },
          complete: () => {
            this._loading = false;
          },
        });
    }
  }

  getSignalById(id: string): Signal<ProgramYear> {
    return computed(() => this.programYearListSig().find((programYear: ProgramYear) => programYear.id === id) || ({} as ProgramYear));
  }

  getById(id: string): Observable<ProgramYear> {
    return this._httpProgramYearService.getProgramYearById$(id);
  }

  create(input: CreateProgramYearCmd): void {
    this._httpProgramYearService.createProgramYear$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._programYearListSig));
  }

  update(id: string, patch: UpdateProgramYearCmd): void {
    this._httpProgramYearService.updateProgramYear$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._programYearListSig));
  }

  remove(id: string): void {
    this._httpProgramYearService.deleteProgramYear$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._programYearListSig));
  }
}

import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateProgramCmd, Program, UpdateProgramCmd } from '@free-spot-domain/program';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpProgramService } from '@http-free-spot/program';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private _httpProgramService: HttpProgramService = inject(HttpProgramService);
  private readonly _destroyRef = inject(DestroyRef);

  private _programListSig: WritableSignal<Program[]> = signal([]);
  programListSig = this._programListSig.asReadonly();

  private _loading = false;
  private _loaded = false;

  init(): void {
    if (this._loaded || this._loading) {
      return;
    }

    if (this._programListSig().length) {
      this._loaded = true;
      return;
    }

    this._loading = true;
    if (!this._programListSig().length) {
      this._httpProgramService
        .listPrograms$()
        .pipe(take(1))
        .subscribe({
          next: (programList: Program[]) => {
            this._programListSig.set(programList);
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

  selectProgramsByFacultyId(facultyId: string): Signal<Program[]> {
    return computed(() => this.programListSig().filter((program: Program) => program.facultyId === facultyId));
  }

  getSignalById(id: string): Signal<Program> {
    return computed(() => this.programListSig().find((program: Program) => program.id === id) || ({} as Program));
  }

  getById(id: string): Observable<Program> {
    return this._httpProgramService.getProgramById$(id);
  }

  create(input: CreateProgramCmd): void {
    this._httpProgramService.createProgram$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._programListSig));
  }

  update(id: string, patch: UpdateProgramCmd): void {
    this._httpProgramService.updateProgram$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._programListSig));
  }

  remove(id: string): void {
    this._httpProgramService.deleteProgram$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._programListSig));
  }
}

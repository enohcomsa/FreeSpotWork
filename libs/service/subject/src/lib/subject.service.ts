import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateSubjectItemCmd, SubjectItem, UpdateSubjectItemCmd } from '@free-spot-domain/subject';
import { HttpSubjectService } from '@http-free-spot/subject';
import { SignalArrayUtil } from '@free-spot/util';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private _httpSubjectService: HttpSubjectService = inject(HttpSubjectService);
  private readonly _destroyRef = inject(DestroyRef);

  private _subjectListSig: WritableSignal<SubjectItem[]> = signal([]);
  subjectListSig = this._subjectListSig.asReadonly();


  init(): void {
    if (!this._subjectListSig().length) {
      this._httpSubjectService
        .listSubjectItems$()
        .pipe(take(1))
        .subscribe((subjectList: SubjectItem[]) => {
          this._subjectListSig.set(subjectList);
        });
    }
  }

  getSignalById(id: string): Signal<SubjectItem> {
    return computed(() => this.subjectListSig().find((subject: SubjectItem) => subject.id === id) || ({} as SubjectItem));
  }

  getById(id: string): Observable<SubjectItem> {
    return this._httpSubjectService.getSubjectItemById$(id);
  }

  create(input: CreateSubjectItemCmd): void {
    this._httpSubjectService.createSubjectItem$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._subjectListSig));
  }

  update(id: string, patch: UpdateSubjectItemCmd): void {
    this._httpSubjectService.updateSubjectItem$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._subjectListSig));
  }

  remove(id: string): void {
    this._httpSubjectService.deleteSubjectItem$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._subjectListSig));
  }
}

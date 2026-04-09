import { Injectable } from '@angular/core';
import { BehaviorSubject, exhaustMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      exhaustMap(() => obs$),
      finalize(() => this.loadingOff()),
    );
  }

  loadingOn(): void {
    this.loadingSubject$.next(true);
  }

  loadingOff(): void {
    this.loadingSubject$.next(false);
  }
}

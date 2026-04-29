import { DestroyRef, Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, exhaustMap, filter } from 'rxjs/operators';

import { UserSetupStore } from '@free-spot/user-setup/data-access';
import { UserSetupDialogComponent } from './user-setup-dialog/user-setup-dialog.component';

@Injectable()
export class UserSetupFlow {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(UserSetupStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly shouldOpenDialog$ = toObservable(this.store.shouldOpenDialogSig);
  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.shouldOpenDialog$
      .pipe(
        distinctUntilChanged(),
        filter(Boolean),
        exhaustMap(() =>
          this.dialog
            .open(UserSetupDialogComponent, {
              delayFocusTrap: true,
              disableClose: true,
              panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2', 'max-h-[75vh]'],
            })
            .afterClosed()
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}

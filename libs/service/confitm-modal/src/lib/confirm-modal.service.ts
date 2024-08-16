import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FreeSpotConfirmModalComponent } from './free-spot-confirm-modal/free-spot-confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmDialog: MatDialog = inject(MatDialog);

  openConfirmDialog(message: string): MatDialogRef<FreeSpotConfirmModalComponent> {
    return this.confirmDialog.open(FreeSpotConfirmModalComponent, {
      disableClose: true,
      data: message,
    });
  }
}

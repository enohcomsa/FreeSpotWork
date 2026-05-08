import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-confirm-modal',

  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './free-spot-confirm-modal.component.html',
  styleUrl: './free-spot-confirm-modal.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotConfirmModalComponent {
  message = inject(MAT_DIALOG_DATA);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'free-spot-confirm-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './free-spot-confirm-modal.component.html',
  styleUrl: './free-spot-confirm-modal.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSpotConfirmModalComponent {
  message = inject(MAT_DIALOG_DATA);
}

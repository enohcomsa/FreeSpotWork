import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'free-spot-add-item-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './add-item-card.component.html',
  styleUrl: './add-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddItemCardComponent {}

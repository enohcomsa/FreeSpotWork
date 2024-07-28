import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AppDateService } from '@free-spot-service/app-date';

@Component({
  selector: 'free-spot-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatListModule, MatDividerModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  private _appDateService: AppDateService = inject(AppDateService);

  opened = false;

  ngOnInit(): void {
    this._appDateService.init();
  }
}

export default NavigationComponent;

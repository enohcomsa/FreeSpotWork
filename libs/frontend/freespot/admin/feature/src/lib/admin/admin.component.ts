import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminUniversityMapComponent } from '@free-spot/admin-university-map/feature';
import { AdminEventsComponent } from '@free-spot/admin-events/feature';
import { AdminAcademicStructureComponent } from '@free-spot/admin-academic-structure/feature';
import { AdminUserAccessComponent } from '@free-spot/admin-user-access/feature';

@Component({
  selector: 'free-spot-admin',
  imports: [
    AdminUserAccessComponent,
    AdminAcademicStructureComponent,
    AdminUniversityMapComponent,
    AdminEventsComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}

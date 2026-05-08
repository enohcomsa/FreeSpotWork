import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { AdminFaculty } from '@free-spot/admin-academic-structure/domain';
import { AdminAcademicStructureStore } from '@free-spot/admin-academic-structure/data-access';

import { FacultyComponent } from '../faculty/faculty.component';

@Component({
  selector: 'free-spot-admin-academic-structure',
  imports: [MatExpansionModule, FacultyComponent],
  templateUrl: './admin-academic-structure.component.html',
  styleUrl: './admin-academic-structure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAcademicStructureComponent implements OnInit {
  private readonly store = inject(AdminAcademicStructureStore);

  readonly facultyListSig: Signal<AdminFaculty[]> = this.store.facultyListSig;

  ngOnInit(): void {
    this.store.init();
  }
}

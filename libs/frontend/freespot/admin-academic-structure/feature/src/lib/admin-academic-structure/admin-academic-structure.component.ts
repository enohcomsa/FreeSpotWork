import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Faculty } from '@free-spot-domain/faculty';
import { AdminAcademicStructureStore } from '@free-spot/admin-academic-structure/data-access';
import { FacultyComponent } from '../faculty/faculty.component';

@Component({
  selector: 'free-spot-admin-academic-structure',
  imports: [MatExpansionModule, FacultyComponent],
  templateUrl: './admin-academic-structure.component.html',
  styleUrl: './admin-academic-structure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAcademicStructureComponent implements OnInit {
  private _store = inject(AdminAcademicStructureStore);

  readonly facultyListSig: Signal<Faculty[]> = this._store.facultyListSig;

  ngOnInit(): void {
    this._store.init();
  }
}

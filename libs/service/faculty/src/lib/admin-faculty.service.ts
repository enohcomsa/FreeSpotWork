import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Faculty, Group, Year } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFacultyService } from '@http-free-spot/faculty';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFacultyService {
  private _httpFacultyService: HttpFacultyService = inject(HttpFacultyService);

  private _facultyListSig: WritableSignal<Faculty[]> = signal([]);
  facultyListSig = this._facultyListSig.asReadonly();

  init(): void {
    this._httpFacultyService
      .getFacultyList()
      .pipe(take(1))
      .subscribe((facultyList: Faculty[]) => {
        this._facultyListSig.set(facultyList.filter((faculty: Faculty) => faculty !== null));
      });
  }

  getFacultyByName(facultyName: string): Signal<Faculty> {
    return computed(() => this.facultyListSig().find((faculty: Faculty) => faculty.name === facultyName) || ({} as Faculty));
  }

  getFacultyByGroupName(groupName: string): Signal<Faculty> {
    return computed(
      () =>
        this.facultyListSig().find((faculty: Faculty) => {
          return faculty.yearList
            ?.map((year: Year) => year.yearGroupList?.some((group: Group) => group.name === groupName))
            .some((checkedYear: boolean) => checkedYear === true);
        }) || ({} as Faculty),
    );
  }

  addFaculty(newFaculty: Faculty): void {
    SignalArrayUtil.addItem(newFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  updateFaculty(oldFaculty: Faculty, updatedFaculty: Faculty): void {
    SignalArrayUtil.replaceItem(oldFaculty, this._facultyListSig, updatedFaculty);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  deleteFaculty(deletedFaculty: Faculty): void {
    SignalArrayUtil.deleteItem(deletedFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }
}

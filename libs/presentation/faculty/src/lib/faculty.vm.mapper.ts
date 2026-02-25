import { Faculty } from '@free-spot-domain/faculty';
import { FacultyVM } from './faculty.vm';

export function toSubjectItemVM(faculty: Faculty): FacultyVM {
  return {
    name: faculty.name,
    shortName: faculty.shortName
  };
}

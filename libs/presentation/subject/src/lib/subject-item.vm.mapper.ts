import { SubjectItem } from '@free-spot-domain/subject';
import { SubjectItemVM } from './subject-item.vm';

export function toSubjectItemVM(subject: SubjectItem): SubjectItemVM {
  return {
    name: subject.name,
    shortName: subject.shortName
  };
}

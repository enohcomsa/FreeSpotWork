import { SubjectItemLegacy } from './subject.model';
import { Year } from './year.model';

export interface Faculty {
  name: string;
  shortName: string;
  subjectList?: SubjectItemLegacy[];
  yearList?: Year[];
}

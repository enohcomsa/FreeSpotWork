import { SubjectItem } from './subject.model';
import { Year } from './year.model';

export interface Faculty {
  name: string;
  shortName: string;
  subjectList?: SubjectItem[];
  yearList: Year[];
}

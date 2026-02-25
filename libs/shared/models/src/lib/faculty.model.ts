import { SubjectItemLegacy } from './subject.model';
import { Year } from './year.model';
/**
 * @deprecated Firebase-era nested model;
 * used only for backward compatibility with legacy faculty structure.
 * Remove once all faculty data is migrated.
 */
export interface FacultyLegacy {
  name: string;
  shortName: string;
  subjectList?: SubjectItemLegacy[];
  yearList?: Year[];
}

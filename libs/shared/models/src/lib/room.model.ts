import { TimeTableItemLecagy } from './timetable-item.model';
import { SubjectItemLegacy } from './subject.model';

/**
 * @deprecated Legacy Firebase-era interface.
 * Replaced by the new Room domain model (e.g. `RoomResponse`, `RoomBase`, etc.)
 * from the FreeSpot API. Avoid using this interface in new code.
 */
export interface RoomLegacy {
  name: string;
  floorName: string;
  subjectList: SubjectItemLegacy[];
  timetable: TimeTableItemLecagy[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}

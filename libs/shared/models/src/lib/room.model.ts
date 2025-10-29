import { TimeTableItem } from './timetable-item.model';
import { SubjectItem } from './subject.model';

/**
 * @deprecated Legacy Firebase-era interface.
 * Replaced by the new Room domain model (e.g. `RoomResponse`, `RoomBase`, etc.)
 * from the FreeSpot API. Avoid using this interface in new code.
 */
export interface RoomLegacy {
  name: string;
  floorName: string;
  subjectList: SubjectItem[];
  timetable: TimeTableItem[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}

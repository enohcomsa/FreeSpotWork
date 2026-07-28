import { ObjectId } from 'mongodb';

import { ACADEMIC_IDS } from './academic.fixtures';

export const CAMPUS_IDS = {
  building: new ObjectId('000000000000000000001001'),

  groundFloor: new ObjectId('000000000000000000001101'),
  firstFloor: new ObjectId('000000000000000000001102'),

  roomP03: new ObjectId('000000000000000000001201'),
  roomP04: new ObjectId('000000000000000000001202'),
  room101: new ObjectId('000000000000000000001203'),
};

export const CAMPUS_DATA = {
  buildings: [
    {
      _id: CAMPUS_IDS.building,
      name: 'Faculty of Electronics',
      address: 'Observatorului 1',
    },
  ],

  floors: [
    {
      _id: CAMPUS_IDS.groundFloor,
      buildingId: CAMPUS_IDS.building,
      name: 'Ground floor',
    },
    {
      _id: CAMPUS_IDS.firstFloor,
      buildingId: CAMPUS_IDS.building,
      name: 'First floor',
    },
  ],

  rooms: [
    {
      _id: CAMPUS_IDS.roomP03,
      buildingId: CAMPUS_IDS.building,
      floorId: CAMPUS_IDS.groundFloor,
      name: 'P03',
      totalSpotsNumber: 120,
      unavailableSpots: 5,
      subjectList: [
        ACADEMIC_IDS.subjectProgramming,
        ACADEMIC_IDS.subjectDatabases,
      ],
    },
    {
      _id: CAMPUS_IDS.roomP04,
      buildingId: CAMPUS_IDS.building,
      floorId: CAMPUS_IDS.groundFloor,
      name: 'P04',
      totalSpotsNumber: 60,
      unavailableSpots: 0,
      subjectList: [
        ACADEMIC_IDS.subjectNetworks,
      ],
    },
    {
      _id: CAMPUS_IDS.room101,
      buildingId: CAMPUS_IDS.building,
      floorId: CAMPUS_IDS.firstFloor,
      name: '101',
      totalSpotsNumber: 30,
      unavailableSpots: 2,
      subjectList: [
        ACADEMIC_IDS.subjectProgramming,
      ],
    },
  ],
} as const;

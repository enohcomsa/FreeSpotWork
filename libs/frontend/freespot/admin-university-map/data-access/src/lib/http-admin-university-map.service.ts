import { inject, Injectable } from '@angular/core';
import {
  BuildingsCardsHttpService,
  BuildingsHttpService,
  FloorsHttpService,
  RoomsHttpService,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
} from '@free-spot/api-client';
import {
  type AdminUniversityMapBuilding,
  type AdminUniversityMapBuildingCard,
  type AdminUniversityMapFloor,
  type AdminUniversityMapRoom,
  type AdminUniversityMapSubject,
  type AdminUniversityMapTimetableActivity,
  type CreateAdminUniversityMapBuildingCmd,
  type CreateAdminUniversityMapFloorCmd,
  type CreateAdminUniversityMapRoomCmd,
  type CreateAdminUniversityMapTimetableActivityCmd,
  type UpdateAdminUniversityMapBuildingCmd,
  type UpdateAdminUniversityMapFloorCmd,
  type UpdateAdminUniversityMapRoomCmd,
} from '@free-spot/admin-university-map/domain';
import { forkJoin, map, Observable } from 'rxjs';

import {
  buildingCardDtoToDomain,
  buildingDtoToDomain,
  createBuildingCmdToDto,
  createFloorCmdToDto,
  createRoomCmdToDto,
  floorDtoToDomain,
  roomDtoToDomain,
  updateBuildingCmdToDto,
  updateFloorCmdToDto,
  updateRoomCmdToDto,
} from './admin-university-map.dto.mapper';
import {
  createTimetableActivityCmdToDto,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
} from './admin-university-map-timetable.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAdminUniversityMapService {
  private readonly buildingsApi = inject(BuildingsHttpService);
  private readonly buildingCardsApi = inject(BuildingsCardsHttpService);
  private readonly floorsApi = inject(FloorsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);
  private readonly subjectsApi = inject(SubjectsHttpService);
  private readonly timetableActivitiesApi = inject(TimetableActivitiesHttpService);

  load$(): Observable<{
    buildings: AdminUniversityMapBuilding[];
    buildingCards: AdminUniversityMapBuildingCard[];
    floors: AdminUniversityMapFloor[];
    rooms: AdminUniversityMapRoom[];
    subjects: AdminUniversityMapSubject[];
    timetableActivities: AdminUniversityMapTimetableActivity[];
  }> {
    return forkJoin({
      buildings: this.listBuildings$(),
      buildingCards: this.listBuildingCards$(),
      floors: this.listFloors$(),
      rooms: this.listRooms$(),
      subjects: this.listSubjects$(),
      timetableActivities: this.listTimetableActivities$(),
    });
  }

  create$(cmd: CreateAdminUniversityMapBuildingCmd): Observable<AdminUniversityMapBuilding> {
    return this.buildingsApi
      .buildingsPost({
        buildingCreateDTO: createBuildingCmdToDto(cmd),
      })
      .pipe(map(buildingDtoToDomain));
  }

  update$(id: string, cmd: UpdateAdminUniversityMapBuildingCmd): Observable<AdminUniversityMapBuilding> {
    return this.buildingsApi
      .buildingsIdPatch({
        id,
        buildingUpdateDTO: updateBuildingCmdToDto(cmd),
      })
      .pipe(map(buildingDtoToDomain));
  }

  remove$(id: string): Observable<void> {
    return this.buildingsApi.buildingsIdDelete({ id }).pipe(map(() => void 0));
  }

  createFloor$(cmd: CreateAdminUniversityMapFloorCmd): Observable<AdminUniversityMapFloor> {
    return this.floorsApi
      .floorsPost({ floorCreateDTO: createFloorCmdToDto(cmd) })
      .pipe(map(floorDtoToDomain));
  }

  updateFloor$(id: string, cmd: UpdateAdminUniversityMapFloorCmd): Observable<AdminUniversityMapFloor> {
    return this.floorsApi
      .floorsIdPatch({
        id,
        floorUpdateDTO: updateFloorCmdToDto(cmd),
      })
      .pipe(map(floorDtoToDomain));
  }

  removeFloor$(id: string): Observable<void> {
    return this.floorsApi.floorsIdDelete({ id }).pipe(map(() => void 0));
  }

  createRoom$(cmd: CreateAdminUniversityMapRoomCmd): Observable<AdminUniversityMapRoom> {
    return this.roomsApi
      .roomsPost({
        roomCreateDTO: createRoomCmdToDto(cmd),
      })
      .pipe(map(roomDtoToDomain));
  }

  updateRoom$(id: string, cmd: UpdateAdminUniversityMapRoomCmd): Observable<AdminUniversityMapRoom> {
    return this.roomsApi
      .roomsIdPatch({
        id,
        roomUpdateDTO: updateRoomCmdToDto(cmd),
      })
      .pipe(map(roomDtoToDomain));
  }

  removeRoom$(id: string): Observable<void> {
    return this.roomsApi.roomsIdDelete({ id }).pipe(map(() => void 0));
  }

  createTimetableActivity$(
    cmd: CreateAdminUniversityMapTimetableActivityCmd,
  ): Observable<AdminUniversityMapTimetableActivity> {
    return this.timetableActivitiesApi
      .timetableActivitiesPost({
        timetableActivityCreateDTO: createTimetableActivityCmdToDto(cmd),
      })
      .pipe(map(timetableActivityDtoToDomain));
  }

  removeTimetableActivity$(id: string): Observable<void> {
    return this.timetableActivitiesApi.timetableActivitiesIdDelete({ id }).pipe(map(() => void 0));
  }

  private listBuildings$(): Observable<AdminUniversityMapBuilding[]> {
    return this.buildingsApi.buildingsGet().pipe(
      map((dtos) => (dtos ?? []).map(buildingDtoToDomain))
    );
  }

  private listBuildingCards$(): Observable<AdminUniversityMapBuildingCard[]> {
    return this.buildingCardsApi.buildingsCardsGet().pipe(
      map((dtos) => (dtos ?? []).map(buildingCardDtoToDomain))
    );
  }

  private listFloors$(): Observable<AdminUniversityMapFloor[]> {
    return this.floorsApi.floorsGet().pipe(
      map((dtos) => (dtos ?? []).map(floorDtoToDomain))
    );
  }

  private listRooms$(): Observable<AdminUniversityMapRoom[]> {
    return this.roomsApi.roomsGet().pipe(
      map((dtos) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  private listSubjects$(): Observable<AdminUniversityMapSubject[]> {
    return this.subjectsApi.subjectsGet().pipe(
      map((dtos) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listTimetableActivities$(): Observable<AdminUniversityMapTimetableActivity[]> {
    return this.timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }
}

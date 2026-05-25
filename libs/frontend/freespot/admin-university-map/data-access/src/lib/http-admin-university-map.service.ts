import { inject, Injectable } from '@angular/core';
import {
  BuildingsCardsHttpService,
  BuildingsHttpService,
  FloorsHttpService,
  RoomsHttpService,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
} from '@free-spot/api-client';
import { forkJoin, map, Observable } from 'rxjs';

import {
  AdminUniversityMapBuilding,
  AdminUniversityMapBuildingCard,
  CreateAdminUniversityMapBuildingCmd,
  UpdateAdminUniversityMapBuildingCmd,
  AdminUniversityMapFloor,
  AdminUniversityMapRoom,
  CreateAdminUniversityMapFloorCmd,
  UpdateAdminUniversityMapFloorCmd,
  CreateAdminUniversityMapRoomCmd,
  UpdateAdminUniversityMapRoomCmd,
  AdminUniversityMapSubject,
  AdminUniversityMapTimetableActivity,
  CreateAdminUniversityMapTimetableActivityCmd,
} from '@free-spot/admin-university-map/domain';

import {
  mapAdminUniversityMapBuildingCardDtoToDomain,
  mapAdminUniversityMapBuildingDtoToDomain,
  mapCreateAdminUniversityMapBuildingCmdToDto,
  mapUpdateAdminUniversityMapBuildingCmdToDto,
  mapAdminUniversityMapFloorDtoToDomain,
  mapAdminUniversityMapRoomDtoToDomain,
  mapCreateAdminUniversityMapFloorCmdToDto,
  mapUpdateAdminUniversityMapFloorCmdToDto,
  mapCreateAdminUniversityMapRoomCmdToDto,
  mapUpdateAdminUniversityMapRoomCmdToDto,
  mapAdminUniversityMapSubjectDtoToDomain,
  mapAdminUniversityMapTimetableActivityDtoToDomain,
  mapCreateAdminUniversityMapTimetableActivityCmdToDto,
} from './admin-university-map.dto.mapper';

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
      buildings: this.buildingsApi.buildingsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapBuildingDtoToDomain)),
      ),
      buildingCards: this.buildingCardsApi.buildingsCardsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapBuildingCardDtoToDomain)),
      ),
      floors: this.floorsApi.floorsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapFloorDtoToDomain)),
      ),
      rooms: this.roomsApi.roomsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapRoomDtoToDomain)),
      ),
      subjects: this.subjectsApi.subjectsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapSubjectDtoToDomain)),
      ),
      timetableActivities: this.timetableActivitiesApi.timetableActivitiesGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminUniversityMapTimetableActivityDtoToDomain)),
      ),
    });
  }

  create$(
    cmd: CreateAdminUniversityMapBuildingCmd,
  ): Observable<AdminUniversityMapBuilding> {
    return this.buildingsApi
      .buildingsPost({
        buildingCreateDTO: mapCreateAdminUniversityMapBuildingCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapBuildingDtoToDomain));
  }

  update$(
    id: string,
    cmd: UpdateAdminUniversityMapBuildingCmd,
  ): Observable<AdminUniversityMapBuilding> {
    return this.buildingsApi
      .buildingsIdPatch({
        id,
        buildingUpdateDTO: mapUpdateAdminUniversityMapBuildingCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapBuildingDtoToDomain));
  }

  remove$(id: string): Observable<void> {
    return this.buildingsApi
      .buildingsIdDelete({ id })
      .pipe(map(() => undefined));
  }

  createFloor$(cmd: CreateAdminUniversityMapFloorCmd): Observable<AdminUniversityMapFloor> {
    return this.floorsApi
      .floorsPost({ floorCreateDTO: mapCreateAdminUniversityMapFloorCmdToDto(cmd) })
      .pipe(map(mapAdminUniversityMapFloorDtoToDomain));
  }

  updateFloor$(
    id: string,
    cmd: UpdateAdminUniversityMapFloorCmd,
  ): Observable<AdminUniversityMapFloor> {
    return this.floorsApi
      .floorsIdPatch({
        id,
        floorUpdateDTO: mapUpdateAdminUniversityMapFloorCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapFloorDtoToDomain));
  }

  removeFloor$(id: string): Observable<void> {
    return this.floorsApi.floorsIdDelete({ id }).pipe(map(() => undefined));
  }

  createRoom$(cmd: CreateAdminUniversityMapRoomCmd): Observable<AdminUniversityMapRoom> {
    return this.roomsApi
      .roomsPost({
        roomCreateDTO: mapCreateAdminUniversityMapRoomCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapRoomDtoToDomain));
  }

  updateRoom$(
    id: string,
    cmd: UpdateAdminUniversityMapRoomCmd,
  ): Observable<AdminUniversityMapRoom> {
    return this.roomsApi
      .roomsIdPatch({
        id,
        roomUpdateDTO: mapUpdateAdminUniversityMapRoomCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapRoomDtoToDomain));
  }

  removeRoom$(id: string): Observable<void> {
    return this.roomsApi.roomsIdDelete({ id }).pipe(map(() => undefined));
  }

  createTimetableActivity$(
    cmd: CreateAdminUniversityMapTimetableActivityCmd,
  ): Observable<AdminUniversityMapTimetableActivity> {
    return this.timetableActivitiesApi
      .timetableActivitiesPost({
        timetableActivityCreateDTO:
          mapCreateAdminUniversityMapTimetableActivityCmdToDto(cmd),
      })
      .pipe(map(mapAdminUniversityMapTimetableActivityDtoToDomain));
  }

  removeTimetableActivity$(id: string): Observable<void> {
    return this.timetableActivitiesApi
      .timetableActivitiesIdDelete({ id })
      .pipe(map(() => undefined));
  }
}



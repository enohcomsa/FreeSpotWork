import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
import { HttpAdminUniversityMapService } from './http-admin-university-map.service';

@Injectable({ providedIn: 'root' })
export class AdminUniversityMapStore {
  private readonly http = inject(HttpAdminUniversityMapService);

  private readonly buildingsSig = signal<AdminUniversityMapBuilding[]>([]);
  private readonly buildingCardsSig = signal<AdminUniversityMapBuildingCard[]>([]);
  private readonly floorsSig = signal<AdminUniversityMapFloor[]>([]);
  private readonly roomsSig = signal<AdminUniversityMapRoom[]>([]);
  private readonly subjectsSig = signal<AdminUniversityMapSubject[]>([]);
  private readonly timetableActivitiesSig = signal<AdminUniversityMapTimetableActivity[]>([]);

  readonly buildingListSig: Signal<AdminUniversityMapBuilding[]> = this.buildingsSig.asReadonly();
  readonly buildingCardList: Signal<AdminUniversityMapBuildingCard[]> = this.buildingCardsSig.asReadonly();//from be not actually true ui vm
  readonly subjectListSig: Signal<AdminUniversityMapSubject[]> = this.subjectsSig.asReadonly();

  init(): void {
    if (this.buildingsSig().length) {
      return;
    }

    this.http.load$().subscribe(({ buildings, buildingCards, floors, rooms, subjects, timetableActivities }) => {
      this.buildingsSig.set(buildings);
      this.buildingCardsSig.set(buildingCards);
      this.floorsSig.set(floors);
      this.roomsSig.set(rooms);
      this.subjectsSig.set(subjects);
      this.timetableActivitiesSig.set(timetableActivities);
    });
  }

  create(cmd: CreateAdminUniversityMapBuildingCmd): void {
    this.http.create$(cmd).subscribe((createdBuilding) => {
      this.buildingsSig.update((buildings) => [...buildings, createdBuilding]);
    });
  }

  update(id: string, cmd: UpdateAdminUniversityMapBuildingCmd): void {
    this.http.update$(id, cmd).subscribe((updatedBuilding) => {
      this.buildingsSig.update((buildings) =>
        buildings.map((building) => (building.id === id ? updatedBuilding : building)),
      );
    });
  }

  remove(id: string): void {
    this.http.remove$(id).subscribe(() => {
      this.buildingsSig.update((buildings) => buildings.filter((building) => building.id !== id));
    });
  }

  getBuildingById(id: string): Signal<AdminUniversityMapBuilding | undefined> {
    return computed(() => this.buildingsSig().find((building) => building.id === id));
  }

  selectFloorsByBuildingId(buildingId: string): Signal<AdminUniversityMapFloor[]> {
    return computed(() => this.floorsSig().filter((floor) => floor.buildingId === buildingId));
  }

  selectRoomsByFloorId(floorId: string): Signal<AdminUniversityMapRoom[]> {
    return computed(() => this.roomsSig().filter((room) => room.floorId === floorId));
  }

  selectFloorsWithRoomsByBuildingId(buildingId: string): Signal<{ floor: AdminUniversityMapFloor; rooms: AdminUniversityMapRoom[]; }[]> {
    return computed(() =>
      this.selectFloorsByBuildingId(buildingId)().map((floor) => ({
        floor,
        rooms: this.selectRoomsByFloorId(floor.id)(),
      })),
    );
  }

  createFloor(cmd: CreateAdminUniversityMapFloorCmd): void {
    this.http.createFloor$(cmd).subscribe((createdFloor) => {
      this.floorsSig.update((floors) => [...floors, createdFloor]);
    });
  }

  updateFloor(id: string, cmd: UpdateAdminUniversityMapFloorCmd): void {
    this.http.updateFloor$(id, cmd).subscribe((updatedFloor) => {
      this.floorsSig.update((floors) => floors.map((floor) => (floor.id === id ? updatedFloor : floor)));
    });
  }

  removeFloor(id: string): void {
    this.http.removeFloor$(id).subscribe(() => {
      this.floorsSig.update((floors) => floors.filter((floor) => floor.id !== id));
    });
  }

  getFloorById(id: string): Signal<AdminUniversityMapFloor | undefined> {
    return computed(() => this.floorsSig().find((floor) => floor.id === id));
  }

  createRoom(cmd: CreateAdminUniversityMapRoomCmd): void {
    this.http.createRoom$(cmd).subscribe((createdRoom) => {
      this.roomsSig.update((rooms) => [...rooms, createdRoom]);
    });
  }

  updateRoom(id: string, cmd: UpdateAdminUniversityMapRoomCmd): void {
    this.http.updateRoom$(id, cmd).subscribe((updatedRoom) => {
      this.roomsSig.update((rooms) => rooms.map((room) => (room.id === id ? updatedRoom : room)));
    });
  }

  removeRoom(id: string): void {
    this.http.removeRoom$(id).subscribe(() => {
      this.roomsSig.update((rooms) => rooms.filter((room) => room.id !== id));
    });
  }

  getRoomById(id: string): Signal<AdminUniversityMapRoom | undefined> {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  selectTimetableActivitiesByRoomId(roomId: string): Signal<AdminUniversityMapTimetableActivity[]> {
    return computed(() => this.timetableActivitiesSig().filter((activity) => activity.roomId === roomId));
  }

  createTimetableActivity(cmd: CreateAdminUniversityMapTimetableActivityCmd): void {
    this.http.createTimetableActivity$(cmd).subscribe((createdActivity) => {
      this.timetableActivitiesSig.update((activities) => [...activities, createdActivity]);
    });
  }

  removeTimetableActivity(id: string): void {
    this.http.removeTimetableActivity$(id).subscribe(() => {
      this.timetableActivitiesSig.update((activities) => activities.filter((activity) => activity.id !== id));
    });
  }
}

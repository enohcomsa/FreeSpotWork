import { Db } from "mongodb";
import { ensureCollection } from "./helpers";
import {
  buildingsSpec, floorsSpec, roomsSpec,
  facultiesSpec, programsSpec, programYearsSpec,
  subjectsSpec, usersSpec, cohortsSpec, timetableActivitiesSpec,
  bookingsSpec,
  eventsSpec,
  refreshTokensSpec,
} from "../schemas";

export async function run(db: Db) {
  await ensureCollection(db, buildingsSpec);
  await ensureCollection(db, floorsSpec);
  await ensureCollection(db, roomsSpec);
  await ensureCollection(db, facultiesSpec);
  await ensureCollection(db, programsSpec);
  await ensureCollection(db, programYearsSpec);
  await ensureCollection(db, cohortsSpec);
  await ensureCollection(db, subjectsSpec);
  await ensureCollection(db, usersSpec);
  await ensureCollection(db, timetableActivitiesSpec);
  await ensureCollection(db, bookingsSpec);
  await ensureCollection(db, eventsSpec);
  await ensureCollection(db, refreshTokensSpec);
}

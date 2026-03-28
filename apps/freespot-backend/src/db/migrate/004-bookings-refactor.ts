import { Db } from "mongodb";
import { ensureCollection } from "./helpers";
import { bookingsSpec } from "../schemas";

export async function run(db: Db) {
  const bookings = db.collection("bookings");

  // 1. rename old cohortId -> groupCohortId only where old field exists
  await bookings.updateMany(
    { cohortId: { $exists: true } },
    {
      $rename: {
        cohortId: "groupCohortId",
      },
    },
    { bypassDocumentValidation: true }
  );

  // 2. backfill new fields if missing
  await bookings.updateMany(
    { facultyId: { $exists: false } },
    { $set: { facultyId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { programId: { $exists: false } },
    { $set: { programId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { programYearId: { $exists: false } },
    { $set: { programYearId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { groupCohortId: { $exists: false } },
    { $set: { groupCohortId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { semigroupCohortId: { $exists: false } },
    { $set: { semigroupCohortId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { subjectId: { $exists: false } },
    { $set: { subjectId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { originalActivityId: { $exists: false } },
    { $set: { originalActivityId: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { isRescheduled: { $exists: false } },
    { $set: { isRescheduled: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { rescheduledAt: { $exists: false } },
    { $set: { rescheduledAt: null } },
    { bypassDocumentValidation: true }
  );

  await bookings.updateMany(
    { updatedAt: { $exists: false } },
    { $set: { updatedAt: null } },
    { bypassDocumentValidation: true }
  );

  // 3. remove old source field
  await bookings.updateMany(
    { source: { $exists: true } },
    { $unset: { source: "" } },
    { bypassDocumentValidation: true }
  );

  // 4. backfill activityType for old rows
  await bookings.updateMany(
    { activityType: { $exists: false } },
    { $set: { activityType: "SPECIAL_EVENT" } },
    { bypassDocumentValidation: true }
  );

  await ensureCollection(db, bookingsSpec);
}


// db/migrate/001-drop-floor-counters.ts
import { Db } from "mongodb";
import { ensureCollection } from "./helpers";
import { floorsSpec } from "../schemas"; // points to the UPDATED spec (without counters)

export async function run(db: Db) {
  const floors = db.collection("floors");

  // 1) Remove the fields from all docs (currently 0 → gone)
  await floors.updateMany(
    {
      $or: [
        { totalSpotsNumber: { $exists: true } },
        { unavailableSpots: { $exists: true } }
      ]
    },
    { $unset: { totalSpotsNumber: "", unavailableSpots: "" } }
  );

  // 2) Re-apply validator + indexes using your helper
  //    (this does collMod under the hood)
  await ensureCollection(db, floorsSpec);
}

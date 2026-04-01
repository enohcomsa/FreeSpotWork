import type { Request } from "express";
import type {
  UserCreateRequest,
  UserMeProfileUpdateRequest,
  UserUpdateRequest,
  UserResponseDto,
  UserMePreferencesUpdateRequest,
} from "../schemas/users.zod";
import * as repo from "../repos/users.repo";
import * as facultiesRepo from "../repos/faculties.repo";
import * as programsRepo from "../repos/programs.repo";
import * as programYearsRepo from "../repos/program-years.repo";
import * as cohortsRepo from "../repos/cohorts.repo";
import * as bookingsRepo from "../repos/bookings.repo";
import * as timetableActivitiesRepo from "../repos/timetable-activities.repo";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getUsers(): Promise<UserResponseDto[]> {
  return repo.listUsers();
}

export async function getUser(id: string): Promise<UserResponseDto> {
  const res = await repo.getUserById(id);

  if (!res) {
    throw new NotFoundError("User not found");
  }

  return res;
}

export async function createUser(
  input: UserCreateRequest,
  passwordHash: string,
): Promise<UserResponseDto> {
  try {
    return await repo.createUser(input, passwordHash);
  } catch (error) {
    mapMongoError(error);
  }
}

async function validateProfileHierarchy(
  input: UserMeProfileUpdateRequest,
): Promise<void> {
  const faculty = await facultiesRepo.getFacultyById(input.facultyId);
  if (!faculty) {
    throw new BadRequestError("Invalid facultyId");
  }

  const program = await programsRepo.getProgramById(input.programId);
  if (!program) {
    throw new BadRequestError("Invalid programId");
  }

  const programYear = await programYearsRepo.getProgramYearById(input.programYearId);
  if (!programYear) {
    throw new BadRequestError("Invalid programYearId");
  }

  const group = await cohortsRepo.getCohortById(input.groupCohortId);
  if (!group) {
    throw new BadRequestError("Invalid groupCohortId");
  }

  if (group.type !== "GROUP") {
    throw new BadRequestError("groupCohortId must reference a GROUP cohort");
  }

  if (String(program.facultyId) !== String(input.facultyId)) {
    throw new BadRequestError("Program does not belong to faculty");
  }

  if (String(programYear.programId) !== String(input.programId)) {
    throw new BadRequestError("Program year does not belong to program");
  }

  if (String(group.programYearId) !== String(input.programYearId)) {
    throw new BadRequestError("Group does not belong to program year");
  }

  if (input.semigroupCohortId) {
    const semigroup = await cohortsRepo.getCohortById(input.semigroupCohortId);

    if (!semigroup) {
      throw new BadRequestError("Invalid semigroupCohortId");
    }

    if (semigroup.type !== "SEMIGROUP") {
      throw new BadRequestError(
        "semigroupCohortId must reference a SEMIGROUP cohort",
      );
    }

    if (String(semigroup.programYearId) !== String(input.programYearId)) {
      throw new BadRequestError("Semigroup does not belong to program year");
    }

    if (String(semigroup.parentGroupId) !== String(input.groupCohortId)) {
      throw new BadRequestError("Semigroup does not belong to group");
    }
  }
}

export async function updateMyProfile(
  req: Request,
  input: UserMeProfileUpdateRequest,
): Promise<UserResponseDto> {
  const claims = req.user;
  if (!claims) {
    throw new UnauthorizedError("Unauthenticated");
  }

  await validateProfileHierarchy(input);

  await bookingsRepo.deleteFutureNormalBookingsForUser(claims.sub);

  let res: UserResponseDto | null;

  try {
    res = await repo.updateUserById(claims.sub, {
      firstName: input.firstName,
      familyName: input.familyName,
      facultyId: input.facultyId,
      programId: input.programId,
      programYearId: input.programYearId,
      groupCohortId: input.groupCohortId,
      semigroupCohortId: input.semigroupCohortId ?? null,
    });
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("User not found");
  }

  const cohortIds = [
    input.groupCohortId,
    input.semigroupCohortId ?? null,
  ].filter((value): value is string => Boolean(value));

  const activities = await timetableActivitiesRepo.findFutureActivitiesForCohorts(
    cohortIds,
  );

  const uniqueActivities = Array.from(
    new Map(activities.map((activity) => [activity._id.toHexString(), activity])).values(),
  );

  for (const activity of uniqueActivities) {
    const status = await bookingsRepo.reserveSpotForActivity(activity._id.toHexString());

    try {
      await bookingsRepo.createBookingFromRecord({
        activityId: activity._id,
        userId: bookingsRepo.toObjectId(claims.sub),

        facultyId: bookingsRepo.toObjectId(input.facultyId),
        programId: bookingsRepo.toObjectId(input.programId),
        programYearId: bookingsRepo.toObjectId(input.programYearId),
        groupCohortId: bookingsRepo.toObjectId(input.groupCohortId),
        semigroupCohortId: input.semigroupCohortId
          ? bookingsRepo.toObjectId(input.semigroupCohortId)
          : null,

        subjectId: activity.subjectId,
        activityType: activity.activityType,
        status,

        originalActivityId: null,
        isRescheduled: false,
        rescheduledAt: null,
        createdAt: new Date(),
        updatedAt: null,
      });
    } catch (error) {
      mapMongoError(error);
    }
  }

  return res;
}

export async function updateMyPreferences(
  req: Request,
  input: UserMePreferencesUpdateRequest,
): Promise<UserResponseDto> {
  const claims = req.user;
  if (!claims) {
    throw new UnauthorizedError("Unauthenticated");
  }

  let res: UserResponseDto | null;

  try {
    res = await repo.updateUserById(claims.sub, {
      preferredLanguage: input.preferredLanguage,
      preferredTheme: input.preferredTheme,
    });
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("User not found");
  }

  return res;
}

export async function updateUser(
  id: string,
  patch: UserUpdateRequest,
): Promise<UserResponseDto> {
  let res: UserResponseDto | null;

  try {
    res = await repo.updateUserById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("User not found");
  }

  return res;
}

export async function deleteUser(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteUserById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("User not found");
  }

  return ok;
}

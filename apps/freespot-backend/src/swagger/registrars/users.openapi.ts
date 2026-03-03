import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { UserUpdate, UserResponse, UserIdParam } from "../../schemas/users.zod";

export function registerUsers(registry: OpenAPIRegistry) {
  registry.register("UserResponse", UserResponse);
  registry.register("UserUpdate", UserUpdate);
  registry.register("UserIdParam", UserIdParam);

  registry.registerPath({
    method: "get",
    path: "/users",
    operationId: "usersGet",
    tags: ["Users"],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: z.array(UserResponse) },
        },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/users/{id}",
    operationId: "usersIdGet",
    tags: ["Users"],
    request: { params: UserIdParam },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: UserResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/users/{id}",
    operationId: "usersIdPatch",
    tags: ["Users"],
    request: {
      params: UserIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: UserUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: {
          "application/json": { schema: UserResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/users/{id}",
    operationId: "usersIdDelete",
    tags: ["Users"],
    request: { params: UserIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}

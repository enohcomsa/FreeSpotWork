import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { SignupSchema, LoginSchema, RefreshSchema, AuthOkResponse } from "../../schemas/auth.zod";

export function registerAuth(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/auth/signup",
    operationId: "authSignup",
    tags: ["Auth"],
    security: [],
    request: {
      body: {
        content: {
          "application/json": { schema: SignupSchema },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: AuthOkResponse },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/auth/login",
    operationId: "authLogin",
    tags: ["Auth"],
    security: [],
    request: {
      body: {
        content: {
          "application/json": { schema: LoginSchema },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: AuthOkResponse },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/auth/refresh",
    operationId: "authRefresh",
    tags: ["Auth"],
    security: [{ accessCookie: [], xsrfHeader: [] }],
    request: {
      body: {
        content: {
          "application/json": { schema: RefreshSchema },
        },
      },
    },
    responses: {
      200: { description: "OK" },
      401: { description: "Unauthenticated" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/auth/me",
    operationId: "authMe",
    tags: ["Auth"],
    security: [{ accessCookie: [] }],
    responses: {
      200: {
        description: "Current authenticated user",
        content: {
          "application/json": { schema: AuthOkResponse },
        },
      },
      401: { description: "Unauthenticated" },
    },
  });
}

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { SubjectCreate, SubjectUpdate, SubjectResponse, SubjectIdParam } from "../../schemas/subjects.zod";
import { z } from "zod";


export function registerSubjects(registry: OpenAPIRegistry) {
  registry.register("SubjectResponse", SubjectResponse);
  registry.register("SubjectCreate", SubjectCreate);
  registry.register("SubjectUpdate", SubjectUpdate);
  registry.register("SubjectIdParam", SubjectIdParam);

    registry.registerPath({
      method: "get",
      path: "/subjects",
      operationId: "subjectsGet",
      tags: ["Subjects"],
      responses: {
        200: {
          description: "OK",
          content: { "application/json": { schema: z.array(SubjectResponse) } },
        },
        500: { description: "Internal server error" },
      },
    });

  registry.registerPath({ method: "get", path: "/subjects/{id}", operationId: "subjectsIdGet", tags: ["Subjects"], request: { params: SubjectIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: SubjectResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/subjects", operationId: "subjectsPost", tags: ["Subjects"], request: { body: { content: { "application/json": { schema: SubjectCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: SubjectResponse } } } } });
  registry.registerPath({ method: "patch", path: "/subjects/{id}", operationId: "subjectsIdPatch", tags: ["Subjects"], request: { params: SubjectIdParam, body: { content: { "application/merge-patch+json": { schema: SubjectUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: SubjectResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/subjects/{id}", operationId: "subjectsIdDelete", tags: ["Subjects"], request: { params: SubjectIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}

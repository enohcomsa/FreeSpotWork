import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type Parts = {
  body?: ZodType<unknown>;
  params?: ZodType<unknown>;
  query?: ZodType<unknown>;
};

function isParts(v: unknown): v is Parts {
  return (
    typeof v === "object" && v !== null && ("body" in (v as Record<string, unknown>) ||
      "params" in (v as Record<string, unknown>) || "query" in (v as Record<string, unknown>))
  );
}

export function validate(parts: Parts): RequestHandler;
export function validate(schema: ZodType<unknown>): RequestHandler;
export function validate(arg: Parts | ZodType<unknown>): RequestHandler {
  return (req, _res, next) => {
    try {
      if (isParts(arg)) {
        if (arg.body) arg.body.parse(req.body);
        if (arg.params) arg.params.parse(req.params);
        if (arg.query) arg.query.parse(req.query);
      } else {
        arg.parse({ body: req.body, params: req.params, query: req.query });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}

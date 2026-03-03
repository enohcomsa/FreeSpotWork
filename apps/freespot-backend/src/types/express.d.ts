import type { AccessTokenClaims } from "../utils/tokens";

declare module "express-serve-static-core" {
  interface Request {
    user?: AccessTokenClaims;
  }
}

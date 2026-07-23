import type { AuthOkResponseT, LoginRequestT, MeResponseT, RefreshResponseT, SignupRequestT } from "../schemas/auth.zod";
import * as svc from "../services/auth.service";
import { withBody, withAuthenticatedRequest } from "../utils/async-handler";

export const signup = withBody<SignupRequestT, AuthOkResponseT>()(async (req, res) => {
  const data = await svc.signup(req, res, req.body);
  res.json(data);
});

export const login = withBody<LoginRequestT, AuthOkResponseT>()(async (req, res) => {
  const data = await svc.login(req, res, req.body);
  res.json(data);
});

export const refresh = withBody<unknown, RefreshResponseT>()(async (req, res) => {
  const data = await svc.refresh(req, res);
  res.json(data);
});

export const logout = withAuthenticatedRequest< { ok: true }>()(async (req, res) => {
  const data = await svc.logout(req, res);
  res.json(data);
});

export const me = withAuthenticatedRequest< MeResponseT>()(async (req, res) => {
  const data = await svc.me(req);
  res.json(data);
});

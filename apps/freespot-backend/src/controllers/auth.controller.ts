import type { AuthOkResponseT, LoginRequestT, SignupRequestT } from "../schemas/auth.zod";
import * as svc from "../services/auth.service";
import { withBody, withParams } from "../utils/async-handler";

export const signup = withBody<SignupRequestT, AuthOkResponseT>()(async (req, res) => {
  const data = await svc.signup(req, res, req.body);
  res.json(data);
});

export const login = withBody<LoginRequestT, AuthOkResponseT>()(async (req, res) => {
  const data = await svc.login(req, res, req.body);
  res.json(data);
});

export const refresh = withBody<unknown, { ok: true }>()(async (req, res) => {
  const data = await svc.refresh(req, res);
  res.json(data);
});

export const logout = withBody<unknown, { ok: true }>()(async (req, res) => {
  const data = await svc.logout(req, res);
  res.json(data);
});

export const me = withParams<Record<string, string>, AuthOkResponseT>()(async (req, res) => {
  const data = await svc.me(req);
  res.json(data);
});

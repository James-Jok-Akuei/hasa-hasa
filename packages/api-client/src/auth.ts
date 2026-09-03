import type {
  RequestOtpInput,
  Session,
  SignupInput,
  SignupVerifyInput,
  VerifyOtpInput,
} from "@hasahasa/shared";
import { request } from "./client";

/** Both verify endpoints return the session plus a bearer token for mobile. */
export type SessionResponse = Session & { token: string };

export const authApi = {
  /** Step one of signup. Writes nothing server-side until the code is used. */
  signup: (input: SignupInput) =>
    request<{ sent: true }>("/auth/signup", { method: "POST", body: input }),

  signupVerify: (input: SignupVerifyInput) =>
    request<SessionResponse>("/auth/signup/verify", {
      method: "POST",
      body: input,
    }),

  /** Step one of login. Answers the same whether or not the account exists. */
  requestLoginOtp: (input: RequestOtpInput) =>
    request<{ sent: true }>("/auth/login", { method: "POST", body: input }),

  loginVerify: (input: VerifyOtpInput) =>
    request<SessionResponse>("/auth/login/verify", {
      method: "POST",
      body: input,
    }),

  me: () => request<Session>("/auth/me"),

  logout: () => request<void>("/auth/logout", { method: "POST" }),
};

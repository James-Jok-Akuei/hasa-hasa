import { ApiError, NetworkError } from "@hasahasa/api-client";

export interface FormState {
  fieldErrors: Record<string, string>;
  formError?: string;
  /** Present on a 429, so the resend countdown can show the real wait. */
  retryAfterSeconds?: number;
}

/**
 * Turns anything thrown by the API client into something the forms render.
 * Validation issues land on their fields; everything else becomes one line
 * above the submit button.
 */
export function toFormState(error: unknown): FormState {
  if (error instanceof ApiError) {
    const fieldErrors = error.fieldErrors();
    return {
      fieldErrors,
      // A message shown twice reads like two separate problems.
      formError: Object.keys(fieldErrors).length ? undefined : error.message,
      retryAfterSeconds: error.retryAfterSeconds,
    };
  }

  if (error instanceof NetworkError) {
    return { fieldErrors: {}, formError: error.message };
  }

  return {
    fieldErrors: {},
    formError: "Something went wrong. Try again.",
  };
}

/** One issue from the API's validation response, keyed the way forms read it. */
export interface ApiIssue {
  path: string[];
  message: string;
}

/**
 * Every non-2xx response becomes one of these. `code` is the API's machine
 * name (EMAIL_IN_USE, COOLDOWN, INVALID...) so callers branch on that rather
 * than on message text.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly issues: ApiIssue[] = [],
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * Collapses issues into the shape the auth forms already render:
   * one message per field, first one wins.
   */
  fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const issue of this.issues) {
      const field = issue.path[0];
      if (field && !out[field]) out[field] = issue.message;
    }
    return out;
  }
}

/** The request never reached the API, or gave up waiting. */
export class NetworkError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "NetworkError";
  }
}

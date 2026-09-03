import { ApiError, NetworkError, type ApiIssue } from "./errors";

/** Hard ceiling per attempt. A stalled socket must not hang a screen. */
const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /**
   * Retry on network failure and 5xx. Defaults to true for GET only.
   *
   * POSTs are not retried by default because ours are not idempotent — a
   * retried /auth/signup that actually succeeded would issue a second code
   * and reset the cooldown. Opt in per call where the endpoint can take it.
   */
  retry?: boolean;
}

let baseUrl = "";

/** Called once at startup. Trailing slashes are trimmed so paths compose. */
export function configureApi(url: string): void {
  baseUrl = url.replace(/\/+$/, "");
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new NetworkError("Request cancelled"));
      },
      { once: true },
    );
  });
}

async function attempt<T>(path: string, options: RequestOptions): Promise<T> {
  const { method = "GET", body, signal } = options;

  // Caller's cancellation and our own deadline both have to abort the fetch.
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body === undefined ? undefined : JSON.stringify(body),
      // Sends and accepts the session cookie. localhost:3000 and :4000 are
      // the same site — ports are not part of site — so SameSite=lax holds.
      credentials: "include",
      signal: combined,
    });
  } catch (error) {
    if (signal?.aborted) throw new NetworkError("Request cancelled", error);
    throw new NetworkError(
      "Could not reach the server. Check your connection and try again.",
      error,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = undefined;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = undefined;
    }
  }

  if (response.ok) return payload as T;

  const data = (payload ?? {}) as {
    error?: string;
    message?: string;
    issues?: ApiIssue[];
    retryAfterSeconds?: number;
  };

  throw new ApiError(
    response.status,
    data.error ?? "REQUEST_FAILED",
    data.message ?? "Something went wrong. Try again.",
    data.issues ?? [],
    data.retryAfterSeconds,
  );
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const retry = options.retry ?? (options.method ?? "GET") === "GET";
  let lastError: unknown;

  for (let i = 0; i < (retry ? MAX_ATTEMPTS : 1); i += 1) {
    try {
      return await attempt<T>(path, options);
    } catch (error) {
      lastError = error;

      // A 4xx is the server's considered answer; repeating it changes nothing.
      const worthRetrying =
        error instanceof NetworkError ||
        (error instanceof ApiError && error.status >= 500);

      if (!worthRetrying || i === MAX_ATTEMPTS - 1) throw error;

      // 300ms, 900ms — enough for a flaky link to recover, short enough that
      // the user is not staring at a spinner.
      await delay(300 * 3 ** i, options.signal);
    }
  }

  throw lastError;
}

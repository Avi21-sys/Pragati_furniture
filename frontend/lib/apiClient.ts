// lib/apiClient.ts — centralized fetch wrapper for the frontend.
// Same-origin so relative paths work (docs/CONVENTIONS.md §4 "API Calls").
// Returns the `data` field of the standard envelope; throws on any error.

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { body?: unknown } = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(path, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Some endpoints (logout) return an empty body.
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
    return undefined as T;
  }

  const parsed = JSON.parse(text) as ApiEnvelope<T>;

  if (!res.ok || parsed.success === false) {
    throw new ApiError(parsed.message ?? `Request failed (${res.status})`, res.status);
  }

  return parsed.data;
}
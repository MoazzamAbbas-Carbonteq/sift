export type ApiErrorBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};

export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;

  constructor(body: ApiErrorBody) {
    super(formatMessage(body.message));
    this.name = "ApiError";
    this.statusCode = body.statusCode;
    this.error = body.error;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body === undefined
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildUrl(path: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const base = apiUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await readErrorBody(response);
  return new ApiError({
    statusCode: body?.statusCode ?? response.status,
    message: body?.message ?? (response.statusText || "Request failed"),
    error: body?.error ?? "Error",
  });
}

async function readErrorBody(
  response: Response,
): Promise<Partial<ApiErrorBody> | undefined> {
  try {
    const body: unknown = await response.json();
    if (typeof body !== "object" || body === null) {
      return undefined;
    }

    const record = body as Record<string, unknown>;
    return {
      statusCode:
        typeof record.statusCode === "number" ? record.statusCode : undefined,
      message: isMessage(record.message) ? record.message : undefined,
      error: typeof record.error === "string" ? record.error : undefined,
    };
  } catch {
    return undefined;
  }
}

function isMessage(value: unknown): value is string | string[] {
  return (
    typeof value === "string" ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

function formatMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join(", ") : message;
}

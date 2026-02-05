const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/";

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

const buildUrl = (path: string, params?: ApiOptions["params"]) => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(normalizedPath, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    ...rest,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...(options ?? {}), method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, {
      ...(options ?? {}),
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, {
      ...(options ?? {}),
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
};


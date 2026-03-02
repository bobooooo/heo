const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
const IS_BROWSER = typeof window !== "undefined";

export function buildApiUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (IS_BROWSER || !API_BASE) return path;
  const normalizedBase = API_BASE.endsWith("/")
    ? API_BASE.slice(0, -1)
    : API_BASE;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(buildApiUrl(path), {
    ...options,
    credentials: "include",
  });
}

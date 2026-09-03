const DOMAIN = process.env["EXPO_PUBLIC_DOMAIN"] || "kdo-cameroon-app.replit.app";
export const API_BASE = `https://${DOMAIN}/api`;

async function request(method: string, path: string, body?: object, token?: string) {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const apiGet    = (path: string, token?: string)               => request("GET",    path, undefined, token);
export const apiPost   = (path: string, body: object, token?: string) => request("POST",   path, body,      token);
export const apiPut    = (path: string, body: object, token?: string) => request("PUT",    path, body,      token);
export const apiDelete = (path: string, token?: string)               => request("DELETE", path, undefined, token);

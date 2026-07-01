// Dev: empty string → Vite proxy forwards /api to backend (vite.config.ts).
// Production: set VITE_API_BASE_URL=https://your-server.up.railway.app in Vercel env.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';

// All requests include credentials so the httpOnly session cookie is sent automatically.
const BASE_OPTS: RequestInit = {
  credentials: 'include',
};

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...BASE_OPTS,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        typeof errBody?.error === 'string'
          ? errBody.error
          : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return response.json();
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...BASE_OPTS,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        typeof errBody?.error === 'string'
          ? errBody.error
          : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return response.json();
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...BASE_OPTS,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        typeof errBody?.error === 'string'
          ? errBody.error
          : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...BASE_OPTS,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        typeof errBody?.error === 'string'
          ? errBody.error
          : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return response.json();
  }
}

export const api = new APIClient(API_BASE_URL);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
    timeout?: number;
    responseType?: 'json' | 'text' | 'arrayBuffer';
    // When true, a 401 will not trigger auth/refresh + retry (avoids loops).
    skipAuthRefresh?: boolean;
}

function normalizeBaseUrl(raw: string): string {
    const trimmed = raw.replace(/\/+$/, '');
    return `${trimmed}/`;
}

class APIClient {
    private baseUrl: string;
    defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    private refreshInFlight: Promise<string | null> | null = null;

    constructor(baseUrl?: string) {
        const fromEnv = typeof import.meta !== 'undefined' && typeof (import.meta as any).env !== 'undefined'
            ? (import.meta as any).env.VITE_API_BASE_URL
            : undefined;
        this.baseUrl = normalizeBaseUrl(baseUrl ?? (typeof fromEnv === 'string' && fromEnv ? fromEnv : 'http://localhost:4000'));
    }

    private canRefreshForEndpoint(endpoint: string): boolean {
        if (endpoint.startsWith('auth/login')) return false;
        if (endpoint.startsWith('auth/register')) return false;
        if (endpoint.startsWith('auth/refresh')) return false;
        if (endpoint.startsWith('auth/logout')) return false;
        return true;
    }

    private async performTokenRefresh(): Promise<string | null> {
        try {
            const url = new URL(`${this.baseUrl}auth/refresh`);
            const { Authorization: _drop, ...headers } = this.defaultHeaders;
            const response = await fetch(url.toString(), {
                method: 'POST',
                credentials: 'include',
                headers,
            });
            if (!response.ok) return null;
            const data = (await response.json()) as { accessToken?: string };
            const at = data.accessToken;
            if (typeof at !== 'string' || !at) return null;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('auth-token', at);
            }
            return at;
        } catch {
            return null;
        }
    }

    private async refreshAccessToken(): Promise<string | null> {
        if (this.refreshInFlight) return this.refreshInFlight;

        const p = this.performTokenRefresh();
        this.refreshInFlight = p;

        try {
            return await p;
        } finally {
            if (this.refreshInFlight === p) {
                this.refreshInFlight = null;
            }
        }
    }

    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { params, timeout, skipAuthRefresh, responseType, ...restInit } = config;
        const url = new URL(`${this.baseUrl}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const headers: Record<string, string> = {
            ...this.defaultHeaders,
            ...(restInit.headers as Record<string, string> | undefined),
        };

        // If body is FormData, do not send Content-Type header; the browser will set multipart boundary.
        // restInit.body can be FormData when callers pass it through.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (restInit.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const controller = new AbortController();
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

        const doFetch = async () =>
            fetch(url.toString(), {
                ...restInit,
                credentials: 'include',
                headers,
                signal: controller.signal,
            });

        try {
            let response = await doFetch();

            if (
                response.status === 401 &&
                !skipAuthRefresh &&
                this.canRefreshForEndpoint(endpoint)
            ) {
                const newToken = await this.refreshAccessToken();
                if (newToken) {
                    this.setAuthToken(newToken);
                    const retryHeaders: Record<string, string> = {
                        ...this.defaultHeaders,
                        ...(restInit.headers as Record<string, string> | undefined),
                    };
                    // If retry body was FormData, ensure we don't set Content-Type here either.
                    if ((restInit as any).body instanceof FormData) delete retryHeaders['Content-Type'];
                    response = await fetch(url.toString(), {
                        ...restInit,
                        credentials: 'include',
                        headers: retryHeaders,
                        signal: controller.signal,
                    });
                }
            }

            let data: unknown;
            if (response.status === 204) {
                data = undefined;
            } else if (responseType === 'arrayBuffer') {
                if (!response.ok) {
                    let errorMessage = response.statusText;
                    try {
                        const errText = await response.text();
                        const parsed = JSON.parse(errText) as { error?: string; message?: string };
                        errorMessage = parsed.error ?? parsed.message ?? errorMessage;
                    } catch {
                        // keep statusText
                    }
                    throw new ApiError(response.status, errorMessage);
                }
                data = await response.arrayBuffer();
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
            }

            if (!response.ok) {
                let errorMessage = response.statusText;
                if (data && typeof data === 'object' && data !== null) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const errorBody = data as any;
                    if (typeof errorBody.error === 'string') {
                        errorMessage = errorBody.error;
                    } else if (typeof errorBody.message === 'string') {
                        errorMessage = errorBody.message;
                    }
                }
                throw new ApiError(response.status, errorMessage, data);
            }

            return data as T;
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            if (err instanceof Error && err.name === 'AbortError') {
                throw new ApiError(408, 'Request timeout');
            }
            throw new ApiError(500, 'Network error or server unreachable');
        } finally {
            if (timeoutId) clearTimeout(timeoutId);
        }
    }

    setAuthToken(token: string | null) {
        if (token) {
            this.defaultHeaders = {
                ...this.defaultHeaders,
                Authorization: `Bearer ${token}`,
            };
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { Authorization: _, ...rest } = this.defaultHeaders;
            this.defaultHeaders = rest;
        }
    }

    /** POST /auth/refresh (cookie session). Updates Bearer header + localStorage on success. */
    async refreshSession(): Promise<string | null> {
        const token = await this.refreshAccessToken();
        if (token) this.setAuthToken(token);
        return token;
    }

    get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
        // Support FormData bodies (for file uploads). When FormData is provided, pass through directly
        // so the browser can set the multipart boundary header.
        if (body instanceof FormData) {
            return this.request<T>(endpoint, { ...config, method: 'POST', body });
        }
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'DELETE',
            body: config?.body,
        });
    }
}

export const api = new APIClient();
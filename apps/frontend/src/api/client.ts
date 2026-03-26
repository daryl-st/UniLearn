// const API_BASE = '/api';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any,
    ) {
        super(message);
        this.name = 'APIError';
    }
}

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
    timeout?: number;
}

class APIClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor(baseUrl: string = 'http://localhost:4000/') { // TODO: make a constant
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const url = new URL(`${this.baseUrl}${endpoint}`);

        // query parameters
        if (config.params) {
            Object.entries(config.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        // Merge headers
        const headers = {
            ...this.defaultHeaders,
            ...config.headers,
        };

        // Timeout handling
        const controller = new AbortController();
        const timeoutId = config.timeout ? setTimeout(() => controller.abort(), config.timeout) : null;

        try {
            // TODO: need to switch to axios 
            const response = await fetch(url.toString(), {
                ...config,
                headers,
                signal: controller.signal,
            });

            // Parse response
            let data: any;
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // error responses
            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    data?.message || data || response.statusText,
                    data
                );
            }

            return data as T;
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            if (err instanceof Error && err.name == 'AbortError') {
                throw new ApiError(408, 'Request timeout');
            }
            throw new ApiError(500, 'Network error or server unreachable');
        } finally {
            if (timeoutId) clearTimeout(timeoutId);
        }
    }

    // set auth token for subsequent requests
    setAuthToken(token: string | null) {
        if (token) {
            this.defaultHeaders = {
                ...this.defaultHeaders,
                'Authorization': `Bearer ${token}`,
            };
        } // else {
        //     const { Authorization, ...rest} = this.defaultHeaders;
        //     this.defaultHeaders = rest;
        // }
    }

    // Generic HTTP methods
    get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET'});
    }

    post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    delte<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE'});
    }
}

// export singleton instance
export const api = new APIClient();
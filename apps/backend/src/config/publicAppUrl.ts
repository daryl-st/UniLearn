/**
 * Base URL for links in transactional emails (verify email, reset password).
 * Must point at the web app users open in the browser, not the API host.
 */
export function getPublicAppBaseUrl(): string {
    const explicit =
        process.env.PUBLIC_APP_URL?.trim() ?? process.env.APP_PUBLIC_URL?.trim();
    if (explicit) {
        return stripTrailingSlash(explicit);
    }

    const origins = (process.env.CLIENT_ORIGIN ?? "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    if (origins.length === 0) {
        return "http://localhost:5173";
    }

    if (origins.length === 1) {
        return stripTrailingSlash(origins[0]!);
    }

    const apiHost = getApiHostHint();
    if (apiHost) {
        const frontend = origins.find((origin) => {
            try {
                return new URL(origin).host !== apiHost;
            } catch {
                return false;
            }
        });
        if (frontend) {
            return stripTrailingSlash(frontend);
        }
    }

    const withoutApiSubdomain = origins.find((origin) => {
        try {
            return !new URL(origin).hostname.startsWith("api.");
        } catch {
            return false;
        }
    });
    if (withoutApiSubdomain) {
        return stripTrailingSlash(withoutApiSubdomain);
    }

    return stripTrailingSlash(origins[origins.length - 1]!);
}

export function buildAppLink(path: string, params?: Record<string, string>): string {
    const base = getPublicAppBaseUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(normalizedPath, `${base}/`);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
    }
    return url.toString();
}

function stripTrailingSlash(url: string): string {
    return url.replace(/\/+$/, "");
}

function getApiHostHint(): string | null {
    const publicApi = process.env.PUBLIC_API_URL?.trim();
    if (!publicApi) return null;
    try {
        return new URL(publicApi).host;
    } catch {
        return null;
    }
}

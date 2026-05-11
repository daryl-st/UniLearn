const DEFAULT_AI_BASE = "http://127.0.0.1:8000";
const FETCH_TIMEOUT_MS = 120_000;

// needs refactoring.
export class AiConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AiConfigError";
    }
}

function normalizeBaseUrl(): string {
    const base = process.env.AI_SERVICE_URL ?? DEFAULT_AI_BASE;
    return base.replace(/\/$/, "");
}

function requireInternalKey(): string {
    // This is not LLM key, rather a shared secret between the backend and the AI service for authentication.
    // This will make sure only the node backend can access the AI service, and not external clients directly.
    const key = process.env.AI_INTERNAL_API_KEY;
    if (!key) {
        throw new AiConfigError("AI_INTERNAL_API_KEY is not configured");
    }
    return key;
}

export type ProxyResult =
    | { ok: true; status: number; body: unknown }
    | { ok: false; status: number; body: unknown };

async function readJsonBody(upstream: globalThis.Response): Promise<unknown> {
    const text = await upstream.text();
    if (!text) return null;
    try {
        return JSON.parse(text) as unknown;
    } catch {
        return { detail: text };
    }
}

export async function proxyExtractFile(
    buffer: Buffer,
    originalname: string,
): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const form = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
    form.append("file", blob, originalname || "upload.pdf");

    // calling the FastAPI endpoint here, and using special header to authenticate the request.
    const upstream = await fetch(`${base}/extract/file`, {
        method: "POST",
        headers: { "X-Internal-API-Key": key },
        body: form,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxyExtractUrl(url: string): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();

    const upstream = await fetch(`${base}/extract/url`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

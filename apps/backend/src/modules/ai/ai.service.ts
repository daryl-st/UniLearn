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

export type IngestChunk = {
    chunk_index: number;
    page_number: number;
    content: string;
    token_count: number;
    embedding: number[] | null;
};

export type IngestResponseBody = {
    resource_id: string;
    metadata: {
        title: string | null;
        author: string | null;
        page_count: number;
    };
    chunks: IngestChunk[];
    warnings: string[];
};

export type AskEmbedResponseBody = {
    embedding: number[];
};

export type AskContextChunk = {
    chunkIndex: number;
    pageNumber: number;
    content: string;
    score: number;
};

export type AskAnswerResponseBody = {
    answer: string;
    citations: Array<{
        chunkIndex: number;
        pageNumber: number;
        score: number;
    }>;
};

export type RagAskResponseBody = {
    resourceId: string;
    answer: string;
    citations: Array<{
        chunkIndex: number;
        pageNumber: number;
        score: number;
    }>;
    usedChunks: number;
};

export type SummarizeResponseBody = {
    resourceId: string;
    summary: string;
};

export type GenerateQuizQuestionBody = {
    type: "mcq" | "short";
    content: string;
    options: Record<string, string> | null;
    correctAns: string;
};

export type GenerateQuizResponseBody = {
    resourceId: string;
    title: string;
    questions: GenerateQuizQuestionBody[];
};

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

export async function proxyIngestResource(
    resourceId: string,
    fileUrl: string,
): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();

    const upstream = await fetch(`${base}/ingest/resource`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resource_id: resourceId,
            pdf_url: fileUrl,
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxyAskEmbed(question: string): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const upstream = await fetch(`${base}/ask/embed`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxyAskAnswer(
    question: string,
    chunks: AskContextChunk[],
): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const upstream = await fetch(`${base}/ask/answer`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, chunks }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxyRagAsk(
    resourceId: string,
    question: string,
    topK?: number,
): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const upstream = await fetch(`${base}/rag/ask`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceId, question, topK }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxySummarize(
    resourceId: string,
    maxChunks?: number,
): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const upstream = await fetch(`${base}/rag/summarize`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resourceId,
            ...(maxChunks !== undefined ? { maxChunks } : {}),
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

export async function proxyGenerateQuiz(params: {
    resourceId: string;
    difficulty: string;
    maxChunks?: number;
    questionCount?: number;
}): Promise<ProxyResult> {
    const key = requireInternalKey();
    const base = normalizeBaseUrl();
    const upstream = await fetch(`${base}/rag/generate-quiz`, {
        method: "POST",
        headers: {
            "X-Internal-API-Key": key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resourceId: params.resourceId,
            difficulty: params.difficulty,
            ...(params.maxChunks !== undefined ? { maxChunks: params.maxChunks } : {}),
            ...(params.questionCount !== undefined
                ? { questionCount: params.questionCount }
                : {}),
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const body = await readJsonBody(upstream);
    if (!upstream.ok) {
        return { ok: false, status: upstream.status, body };
    }
    return { ok: true, status: upstream.status, body };
}

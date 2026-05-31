import { createHash, randomUUID } from "node:crypto";

const OFFICE_EXTENSIONS = new Set([
    ".doc",
    ".docx",
    ".docm",
    ".dotx",
    ".rtf",
    ".txt",
    ".ppt",
    ".pptx",
    ".pptm",
    ".pot",
    ".potm",
    ".potx",
    ".pps",
    ".ppsm",
]);

export function sanitizeFilename(filename: string): string {
    const base = filename.split(/[/\\]/).pop() ?? "file";
    return base.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
}

export function basenameWithoutPdfExtension(filename: string): string {
    const safe = sanitizeFilename(filename);
    return safe.toLowerCase().endsWith(".pdf") ? safe.slice(0, -4) : safe;
}

export function buildResourcePublicId(
    filename?: string,
    opts?: { omitPdfExtension?: boolean },
): string {
    const safeName = filename
        ? opts?.omitPdfExtension
            ? basenameWithoutPdfExtension(filename)
            : sanitizeFilename(filename)
        : "file";
    return `unilearn/resources/${randomUUID()}/${safeName}`;
}

export function extensionOf(filename: string): string {
    const dot = filename.lastIndexOf(".");
    return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

export function isPdfFile(filename: string, mimeType?: string): boolean {
    const mime = (mimeType ?? "").toLowerCase();
    return mime === "application/pdf" || extensionOf(filename) === ".pdf";
}

export function isOfficeFile(filename: string, mimeType?: string): boolean {
    if (isPdfFile(filename, mimeType)) return false;
    const ext = extensionOf(filename);
    if (OFFICE_EXTENSIONS.has(ext)) return true;
    const mime = (mimeType ?? "").toLowerCase();
    return (
        mime.includes("word") ||
        mime.includes("powerpoint") ||
        mime.includes("presentation") ||
        mime.includes("msword") ||
        mime.includes("officedocument")
    );
}

export function buildPdfDeliveryUrl(
    publicId: string,
    cloudName: string,
): string {
    const encoded = publicId
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
    // Converted Office assets keep the original extension in public_id (e.g. slides.pptx).
    return `https://res.cloudinary.com/${cloudName}/image/upload/${encoded}`;
}

/** Return the stored Cloudinary URL unchanged — raw PDF delivery works when image PDF CDN is restricted. */
export function resolveCloudinaryViewerUrl(
    fileUrl: string,
    _type?: "PDF" | "PPT" | "DOC",
): string {
    return fileUrl;
}

/** True when a stored delivery URL is served from Cloudinary. */
export function isCloudinaryDeliveryUrl(fileUrl: string): boolean {
    try {
        const host = new URL(fileUrl).hostname.toLowerCase();
        return host === "res.cloudinary.com" || host.endsWith(".cloudinary.com");
    } catch {
        return false;
    }
}

/** Extract Cloudinary public_id from a delivery URL (unsigned or signed). */
export function parsePublicIdFromCloudinaryUrl(fileUrl: string): string | null {
    try {
        const u = new URL(fileUrl);
        if (!isCloudinaryDeliveryUrl(fileUrl)) return null;

        const match = u.pathname.match(
            /\/(?:image|raw|video|auto)\/upload(?:\/s--[^/]+--)?(?:\/v\d+)?\/(.+)$/,
        );
        if (!match?.[1]) return null;

        return decodeURIComponent(match[1]);
    } catch {
        return null;
    }
}

export class CloudinaryDownloadError extends Error {
    constructor(
        message: string,
        readonly code: "NOT_FOUND" | "FETCH_FAILED",
    ) {
        super(message);
        this.name = "CloudinaryDownloadError";
    }
}

export function getNotificationUrl(): string | undefined {
    const base = process.env.PUBLIC_API_URL?.replace(/\/$/, "");
    if (!base) return undefined;
    return `${base}/course/cloudinary/notification`;
}

/** When true, Office uploads request Aspose PDF conversion (requires Cloudinary add-on). */
export function isAsposeConversionEnabled(): boolean {
    return process.env.CLOUDINARY_ASPOSE_ENABLED === "true";
}

type CloudinaryLikeError = {
    http_code?: number;
    message?: string;
    name?: string;
};

export function isAsposeSubscriptionError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const e = err as CloudinaryLikeError;
    if (e.http_code === 420) return true;
    const msg = (e.message ?? "").toLowerCase();
    return msg.includes("aspose") || msg.includes("subscription");
}

export function cloudinaryErrorMessage(err: unknown): string {
    if (!err || typeof err !== "object") return "Failed to upload file to storage.";
    const e = err as CloudinaryLikeError;
    if (typeof e.message === "string" && e.message.trim()) return e.message;
    return "Failed to upload file to storage.";
}

export function verifyNotificationSignature(
    rawBody: string,
    timestamp: string | undefined,
    signature: string | undefined,
    apiSecret: string,
    maxAgeSeconds = 7200,
): boolean {
    if (!timestamp || !signature) return false;

    const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number.parseInt(timestamp, 10));
    if (Number.isNaN(ageSeconds) || ageSeconds > maxAgeSeconds) return false;

    const payload = rawBody + timestamp + apiSecret;
    const expected = createHash("sha1").update(payload).digest("hex");
    return expected === signature;
}

export function parseCloudinaryPublicId(payload: Record<string, unknown>): string | undefined {
    const publicId = payload.public_id;
    return typeof publicId === "string" && publicId.length > 0 ? publicId : undefined;
}

export function isConversionFailure(payload: Record<string, unknown>): boolean {
    const status = payload.status ?? payload.notification_type;
    if (status === "error" || status === "failed") return true;
    const info = payload.info;
    if (typeof info === "string" && info.toLowerCase().includes("error")) return true;
    return false;
}

export function isConversionComplete(payload: Record<string, unknown>): boolean {
    const notificationType = payload.notification_type;
    if (notificationType === "error") return false;

    const eager = payload.eager;
    if (Array.isArray(eager) && eager.length > 0) {
        return eager.some((item) => {
            if (!item || typeof item !== "object") return false;
            const format = (item as { format?: string }).format;
            return format === "pdf";
        });
    }

    if (payload.raw_convert === "aspose" && payload.status === "complete") return true;

    const info = payload.info;
    if (typeof info === "object" && info !== null) {
        const status = (info as { status?: string }).status;
        if (status === "complete") return true;
    }

    return notificationType === "upload" && payload.resource_type === "image";
}

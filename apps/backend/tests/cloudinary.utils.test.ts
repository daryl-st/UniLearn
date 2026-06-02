import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
    buildPdfDeliveryUrl,
    buildResourcePublicId,
    extensionOf,
    isCloudinaryDeliveryUrl,
    isOfficeFile,
    isPdfFile,
    isConversionComplete,
    isConversionFailure,
    parsePublicIdFromCloudinaryUrl,
    sanitizeFilename,
    resolveCloudinaryViewerUrl,
    verifyNotificationSignature,
} from "../src/modules/resource/cloudinary.utils.js";

describe("cloudinary.utils", () => {
    it("sanitizeFilename replaces unsafe characters", () => {
        expect(sanitizeFilename("My Lecture Notes.pdf")).toBe("My_Lecture_Notes.pdf");
        expect(sanitizeFilename("path/to/file.docx")).toBe("file.docx");
    });

    it("buildResourcePublicId includes folder and preserves extension", () => {
        const id = buildResourcePublicId("slides.pptx");
        expect(id).toMatch(/^unilearn\/resources\/[0-9a-f-]+\/slides\.pptx$/);
    });

    it("detects pdf and office files", () => {
        expect(isPdfFile("notes.pdf")).toBe(true);
        expect(isPdfFile("slides.pptx")).toBe(false);
        expect(isOfficeFile("slides.pptx")).toBe(true);
        expect(isOfficeFile("notes.pdf")).toBe(false);
        expect(extensionOf("a.b.c.docx")).toBe(".docx");
    });

    it("buildPdfDeliveryUrl encodes path segments", () => {
        const url = buildPdfDeliveryUrl("unilearn/resources/id/file.docx", "demo");
        expect(url).toBe("https://res.cloudinary.com/demo/image/upload/unilearn/resources/id/file.docx");
    });

    it("resolveCloudinaryViewerUrl returns the stored URL unchanged", () => {
        const raw =
            "https://res.cloudinary.com/demo/raw/upload/v1/unilearn/resources/id/notes.pdf";
        expect(resolveCloudinaryViewerUrl(raw, "PDF")).toBe(raw);
    });

    it("buildResourcePublicId omits pdf extension when requested", () => {
        const id = buildResourcePublicId("Motivation.pdf", { omitPdfExtension: true });
        expect(id).toMatch(/\/Motivation$/);
        expect(id).not.toMatch(/\.pdf$/);
    });

    it("parsePublicIdFromCloudinaryUrl extracts public_id", () => {
        expect(
            parsePublicIdFromCloudinaryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1780253358/unilearn/resources/id/test-viewer",
            ),
        ).toBe("unilearn/resources/id/test-viewer");
        expect(
            parsePublicIdFromCloudinaryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1780032060/Chapter_3-_Decidability_.pdf",
            ),
        ).toBe("Chapter_3-_Decidability_.pdf");
    });

    it("isCloudinaryDeliveryUrl detects Cloudinary hosts", () => {
        expect(
            isCloudinaryDeliveryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1/unilearn/resources/id/notes.pdf",
            ),
        ).toBe(true);
        expect(isCloudinaryDeliveryUrl("https://www.w3.org/test.pdf")).toBe(false);
    });

    it("verifyNotificationSignature validates sha1 payload", () => {
        const body = '{"public_id":"abc"}';
        const timestamp = "1710000000";
        const secret = "test-secret";
        const signature = createHash("sha1").update(body + timestamp + secret).digest("hex");

        expect(verifyNotificationSignature(body, timestamp, signature, secret, 999999999)).toBe(true);
        expect(verifyNotificationSignature(body, timestamp, "bad", secret, 999999999)).toBe(false);
    });

    it("isConversionComplete detects eager pdf transformation", () => {
        expect(
            isConversionComplete({
                notification_type: "upload",
                eager: [{ format: "pdf", secure_url: "https://example.com/x.pdf" }],
            }),
        ).toBe(true);
        expect(isConversionFailure({ notification_type: "error" })).toBe(true);
    });
});

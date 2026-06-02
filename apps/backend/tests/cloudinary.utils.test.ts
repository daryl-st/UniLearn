import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
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
        assert.equal(sanitizeFilename("My Lecture Notes.pdf"), "My_Lecture_Notes.pdf");
        assert.equal(sanitizeFilename("path/to/file.docx"), "file.docx");
    });

    it("buildResourcePublicId includes folder and preserves extension", () => {
        const id = buildResourcePublicId("slides.pptx");
        assert.match(id, /^unilearn\/resources\/[0-9a-f-]+\/slides\.pptx$/);
    });

    it("detects pdf and office files", () => {
        assert.equal(isPdfFile("notes.pdf"), true);
        assert.equal(isPdfFile("slides.pptx"), false);
        assert.equal(isOfficeFile("slides.pptx"), true);
        assert.equal(isOfficeFile("notes.pdf"), false);
        assert.equal(extensionOf("a.b.c.docx"), ".docx");
    });

    it("buildPdfDeliveryUrl encodes path segments", () => {
        const url = buildPdfDeliveryUrl("unilearn/resources/id/file.docx", "demo");
        assert.equal(
            url,
            "https://res.cloudinary.com/demo/image/upload/unilearn/resources/id/file.docx",
        );
    });

    it("resolveCloudinaryViewerUrl returns the stored URL unchanged", () => {
        const raw =
            "https://res.cloudinary.com/demo/raw/upload/v1/unilearn/resources/id/notes.pdf";
        assert.equal(resolveCloudinaryViewerUrl(raw, "PDF"), raw);
    });

    it("buildResourcePublicId omits pdf extension when requested", () => {
        const id = buildResourcePublicId("Motivation.pdf", { omitPdfExtension: true });
        assert.match(id, /\/Motivation$/);
        assert.doesNotMatch(id, /\.pdf$/);
    });

    it("parsePublicIdFromCloudinaryUrl extracts public_id", () => {
        assert.equal(
            parsePublicIdFromCloudinaryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1780253358/unilearn/resources/id/test-viewer",
            ),
            "unilearn/resources/id/test-viewer",
        );
        assert.equal(
            parsePublicIdFromCloudinaryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1780032060/Chapter_3-_Decidability_.pdf",
            ),
            "Chapter_3-_Decidability_.pdf",
        );
    });

    it("isCloudinaryDeliveryUrl detects Cloudinary hosts", () => {
        assert.equal(
            isCloudinaryDeliveryUrl(
                "https://res.cloudinary.com/demo/raw/upload/v1/unilearn/resources/id/notes.pdf",
            ),
            true,
        );
        assert.equal(isCloudinaryDeliveryUrl("https://www.w3.org/test.pdf"), false);
    });

    it("verifyNotificationSignature validates sha1 payload", () => {
        const body = '{"public_id":"abc"}';
        const timestamp = "1710000000";
        const secret = "test-secret";
        const signature = createHash("sha1").update(body + timestamp + secret).digest("hex");

        assert.equal(verifyNotificationSignature(body, timestamp, signature, secret, 999999999), true);
        assert.equal(verifyNotificationSignature(body, timestamp, "bad", secret, 999999999), false);
    });

    it("isConversionComplete detects eager pdf transformation", () => {
        assert.equal(
            isConversionComplete({
                notification_type: "upload",
                eager: [{ format: "pdf", secure_url: "https://example.com/x.pdf" }],
            }),
            true,
        );
        assert.equal(isConversionFailure({ notification_type: "error" }), true);
    });
});

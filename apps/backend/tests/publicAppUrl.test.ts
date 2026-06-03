import { afterEach, describe, expect, it } from "vitest";

import { buildAppLink, getPublicAppBaseUrl } from "../src/config/publicAppUrl.js";

describe("publicAppUrl", () => {
    const previous = { ...process.env };

    afterEach(() => {
        process.env = { ...previous };
    });

    it("prefers PUBLIC_APP_URL over CLIENT_ORIGIN", () => {
        process.env.PUBLIC_APP_URL = "https://app.example.com";
        process.env.CLIENT_ORIGIN = "https://api.example.com,https://wrong.example.com";
        expect(getPublicAppBaseUrl()).toBe("https://app.example.com");
    });

    it("picks non-API origin when PUBLIC_API_URL is set", () => {
        delete process.env.PUBLIC_APP_URL;
        process.env.PUBLIC_API_URL = "https://api.example.com";
        process.env.CLIENT_ORIGIN = "https://api.example.com,https://app.example.com";
        expect(getPublicAppBaseUrl()).toBe("https://app.example.com");
    });

    it("builds verify-email links with encoded token", () => {
        process.env.PUBLIC_APP_URL = "https://app.example.com";
        const link = buildAppLink("/verify-email", { token: "abc+def" });
        expect(link).toBe("https://app.example.com/verify-email?token=abc%2Bdef");
    });
});

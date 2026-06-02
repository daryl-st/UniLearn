import { describe, expect, it } from "vitest";

import type { RequestHandler } from "express";
import { createMockRequest, createMockResponse } from "./helpers/httpMocks.js";
import { makeAccessToken, ensureTestSecrets } from "./helpers/jwt.js";

function runHandler(handler: RequestHandler, req: Parameters<RequestHandler>[0]) {
    const res = createMockResponse();
    let nextCalled = false;
    handler(req, res as never, () => {
        nextCalled = true;
    });
    return { res, nextCalled };
}

describe("rbac route protections", () => {
    it("requireAuth rejects missing bearer token", async () => {
        ensureTestSecrets();
        const { requireAuth } = await import("../src/middlewares/auth.js");
        const req = createMockRequest({ headers: {} });
        const { res, nextCalled } = runHandler(requireAuth, req);

        expect(nextCalled).toBe(false);
        expect(res.statusCode).toBe(401);
    });

    it("requireAuth accepts valid bearer token", async () => {
        ensureTestSecrets();
        const { requireAuth } = await import("../src/middlewares/auth.js");
        const token = makeAccessToken("user-1", "STUDENT");
        const req = createMockRequest({
            headers: { authorization: `Bearer ${token}` },
        });
        const { res, nextCalled } = runHandler(requireAuth, req);

        expect(res.statusCode).toBe(200);
        expect(nextCalled).toBe(true);
    });

    it("authorize blocks non-admin role from admin routes", async () => {
        const { authorize } = await import("../src/middlewares/auth.js");
        const handler = authorize("ADMIN");
        const req = createMockRequest({
            user: { userId: "student-1", role: "STUDENT" },
        });
        const { res, nextCalled } = runHandler(handler, req);

        expect(nextCalled).toBe(false);
        expect(res.statusCode).toBe(403);
        expect(res.payload).toEqual({ error: "Forbidden" });
    });

    it("authorize allows matching role for student-only routes", async () => {
        const { authorize } = await import("../src/middlewares/auth.js");
        const handler = authorize("STUDENT");
        const req = createMockRequest({
            user: { userId: "student-1", role: "STUDENT" },
        });
        const { res, nextCalled } = runHandler(handler, req);

        expect(res.statusCode).toBe(200);
        expect(nextCalled).toBe(true);
    });

    it("authorize rejects instructor against student-only route", async () => {
        const { authorize } = await import("../src/middlewares/auth.js");
        const handler = authorize("STUDENT");
        const req = createMockRequest({
            user: { userId: "instructor-1", role: "INSTRUCTOR" },
        });
        const { res, nextCalled } = runHandler(handler, req);

        expect(nextCalled).toBe(false);
        expect(res.statusCode).toBe(403);
    });
});

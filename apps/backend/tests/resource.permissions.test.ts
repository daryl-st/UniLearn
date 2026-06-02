import { describe, expect, it } from "vitest";

import { deleteResourceBodySchema } from "../src/schemas/index.js";
import { ResourceService } from "../src/modules/resource/resource.service.js";

describe("resource lifecycle permissions", () => {
    it("requires instructorId in delete body (current route contract)", () => {
        const parsed = deleteResourceBodySchema.safeParse({});
        expect(parsed.success).toBe(false);
    });

    it("denies delete when resource belongs to another instructor", async () => {
        const service = new ResourceService({
            findOne: async () => ({
                id: "resource-1",
                instructorId: "instructor-a",
            }),
            delete: async () => ({ id: "resource-1", isDeleted: true }),
        } as never);

        const result = await service.deleteResource({ id: "resource-1" }, "instructor-b");
        expect(result).toBe("Permission Denied!");
    });

    it("allows delete when instructor owns the resource", async () => {
        const service = new ResourceService({
            findOne: async () => ({
                id: "resource-1",
                instructorId: "instructor-a",
            }),
            delete: async () => ({ id: "resource-1", isDeleted: true }),
        } as never);

        const result = await service.deleteResource({ id: "resource-1" }, "instructor-a");
        expect(result).toEqual({ id: "resource-1", isDeleted: true });
    });
});

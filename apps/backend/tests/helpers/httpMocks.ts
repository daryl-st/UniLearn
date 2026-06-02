import type { Request, Response } from "express";

type JsonValue = unknown;

export interface MockResponse extends Partial<Response> {
    statusCode: number;
    payload?: JsonValue;
}

export function createMockRequest(partial: Partial<Request> = {}): Request {
    return partial as Request;
}

export function createMockResponse(): MockResponse {
    const res: MockResponse = {
        statusCode: 200,
    };

    res.status = ((code: number) => {
        res.statusCode = code;
        return res as Response;
    }) as Response["status"];

    res.json = ((payload: JsonValue) => {
        res.payload = payload;
        return res as Response;
    }) as Response["json"];

    return res;
}

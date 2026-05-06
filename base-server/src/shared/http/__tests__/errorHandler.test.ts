import Fastify, { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { Logger } from "@/core/config/logger";
import { ERROR_CODES } from "@/shared/constants/errorCodes";
import { DomainError } from "@/shared/errors";
import { createErrorHandler } from "@/shared/http/errorHandler";

function makeApp(): FastifyInstance {
	const logger = new Logger();
	const app = Fastify({ logger: false });
	app.setErrorHandler(createErrorHandler(logger));
	return app;
}

describe("createErrorHandler", () => {
	let app: FastifyInstance;

	beforeEach(() => {
		app = makeApp();
	});

	afterEach(async () => {
		await app.close();
	});

	it("returns 500 with generic body for unknown errors", async () => {
		app.get("/boom", () => {
			throw new Error("boom");
		});

		const response = await app.inject({ method: "GET", url: "/boom" });

		expect(response.statusCode).toBe(500);
		expect(response.json()).toMatchObject({
			error: "Internal Server Error",
			message: "An unexpected error occurred",
		});
	});

	it("returns 422 for ZodError", async () => {
		app.get("/zod", () => {
			const result = ZodError.create([
				{
					code: "invalid_type",
					expected: "string",
					received: "undefined",
					path: ["email"],
					message: "Required",
				},
			]);
			throw result;
		});

		const response = await app.inject({ method: "GET", url: "/zod" });

		expect(response.statusCode).toBe(422);
		expect(response.json()).toMatchObject({
			error: "VALIDATION_ERROR",
			message: "Validation failed for field: email",
		});
	});

	it("returns DomainError statusCode and code", async () => {
		app.get("/domain", () => {
			throw new DomainError("Not found", {
				code: ERROR_CODES.VALIDATION_ERROR,
				statusCode: 404,
			});
		});

		const response = await app.inject({ method: "GET", url: "/domain" });

		expect(response.statusCode).toBe(404);
		expect(response.json()).toMatchObject({
			error: ERROR_CODES.VALIDATION_ERROR,
		});
	});
});

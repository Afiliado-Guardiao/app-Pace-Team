import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { env } from "@/core/config/env";
import { Logger } from "@/core/config/logger";
import { detectLanguageFromHeader } from "@/core/i18n";
import { DomainError } from "@/shared/errors";

// ZodError retorna 422 (Unprocessable Entity) em vez de 400.
// 400 = request malformada (sintaxe); 422 = request bem-formada mas
// semanticamente inválida (validação de campo). RFC 9110 §15.5.23.

type FastifyErrorHandler = (
	error: unknown,
	request: FastifyRequest,
	reply: FastifyReply,
) => void | Promise<void>;

export function createErrorHandler(logger: Logger): FastifyErrorHandler {
	return function handleError(error: unknown, request: FastifyRequest, reply: FastifyReply): void {
		const { method, url } = request;

		if (error instanceof ZodError) {
			const firstError = error.errors[0];
			const fieldName = firstError?.path.join(".") ?? "unknown";

			logger.warn("Validation error", { method, url, field: fieldName });

			const body: Record<string, unknown> = {
				error: "VALIDATION_ERROR",
				message: `Validation failed for field: ${fieldName}`,
			};

			if (env.NODE_ENV !== "production") {
				body.details = error.errors;
			}

			void reply.status(422).send(body);
			return;
		}

		if (error instanceof DomainError) {
			const lang = detectLanguageFromHeader(request.headers["accept-language"]);
			const message = error.getLocalizedMessage(lang);

			logger.warn("Domain error", { method, url, statusCode: error.statusCode, code: error.code });

			void reply.status(error.statusCode).send({ error: error.code, message });
			return;
		}

		const err = error instanceof Error ? error : new Error(String(error));
		logger.error("Unknown error", err);

		void reply.status(500).send({
			error: "Internal Server Error",
			message: "An unexpected error occurred",
		});
	};
}

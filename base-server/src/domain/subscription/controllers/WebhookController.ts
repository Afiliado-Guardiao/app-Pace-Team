import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { Logger } from "@/core/config/logger";
import { detectLanguageFromHeader } from "@/core/i18n";
import { DomainError } from "@/shared/errors";

import { WebhookPathSecretInvalidError, WebhookSignatureInvalidError } from "../errors";
import {
	IWebhookProcessor,
	IWebhookVerifier,
	paywalloWebhookPayloadSchema,
	WebhookPathParam,
	webhookPathParamSchema,
} from "../types";

interface IRawBodyRequest extends FastifyRequest {
	rawBody?: string;
}

export class WebhookController {
	constructor(
		private logger: Logger,
		private webhookVerifier: IWebhookVerifier,
		private webhookProcessor: IWebhookProcessor,
	) {}

	async receive(
		request: FastifyRequest<{ Params: WebhookPathParam; Body: unknown }>,
		reply: FastifyReply,
	): Promise<void> {
		try {
			const { pathSecret } = webhookPathParamSchema.parse(request.params);

			if (!this.webhookVerifier.verifyPathSecret(pathSecret)) {
				throw new WebhookPathSecretInvalidError();
			}

			const rawBody = (request as IRawBodyRequest).rawBody ?? "";
			const signature = this.extractSignatureHeader(request);

			if (!this.webhookVerifier.verifySignature(rawBody, signature)) {
				throw new WebhookSignatureInvalidError();
			}

			const payload = paywalloWebhookPayloadSchema.parse(request.body);
			const result = await this.webhookProcessor.process(payload);

			void reply.status(200).send({
				received: true,
				eventId: result.eventId,
				deduplicated: result.deduplicated,
			});
		} catch (error) {
			this.handleError(error, reply, request);
		}
	}

	private extractSignatureHeader(request: FastifyRequest): string | undefined {
		const header = request.headers["x-paywallo-signature"];
		if (Array.isArray(header)) return header[0];
		return header;
	}

	private handleError(error: unknown, reply: FastifyReply, request: FastifyRequest): void {
		const language = detectLanguageFromHeader(request.headers["accept-language"]);

		if (error instanceof ZodError) {
			const firstError = error.errors[0];
			void reply.status(400).send({
				error: "VALIDATION_ERROR",
				message: `Validation failed for field: ${firstError?.path.join(".") ?? "unknown"}`,
				details: error.errors,
			});
			return;
		}

		if (error instanceof DomainError) {
			void reply.status(error.statusCode).send({
				error: error.code,
				message: error.getLocalizedMessage(language),
			});
			return;
		}

		const err = error instanceof Error ? error : new Error(String(error));
		this.logger.error("Unknown error in webhook controller", err);
		void reply.status(500).send({
			error: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred",
		});
	}
}

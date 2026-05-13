import { FastifyInstance } from "fastify";

import { IRoute } from "@/shared/types";

import { WebhookController } from "../controllers/WebhookController";
import { WebhookPathParam } from "../types";

interface IRawBodyRequest {
	rawBody?: string;
}

export class SubscriptionRoutes implements IRoute {
	constructor(private webhookController: WebhookController) {}

	async register(app: FastifyInstance): Promise<void> {
		// Plugin encapsulado: registra parser que preserva raw body apenas neste escopo.
		// O HMAC do header X-Paywallo-Signature é calculado sobre o bytes-perfect do body.
		await app.register((scopedApp, _opts, done) => {
			scopedApp.addContentTypeParser(
				"application/json",
				{ parseAs: "string" },
				(req, body, parserDone) => {
					try {
						const stringBody = body as string;
						const parsed = stringBody.length > 0 ? (JSON.parse(stringBody) as unknown) : {};
						(req as unknown as IRawBodyRequest).rawBody = stringBody;
						parserDone(null, parsed);
					} catch (err) {
						parserDone(err as Error);
					}
				},
			);

			scopedApp.post<{ Params: WebhookPathParam; Body: unknown }>(
				"/webhooks/paywallo/:pathSecret",
				{
					handler: async (request, reply) => {
						return this.webhookController.receive(request, reply);
					},
				},
			);

			done();
		});
	}
}

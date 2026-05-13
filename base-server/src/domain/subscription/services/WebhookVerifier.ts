import { createHmac, timingSafeEqual } from "crypto";

import { Logger } from "@/core/config/logger";

import { IWebhookVerifier } from "../types";

interface IWebhookVerifierConfig {
	pathSecret: string;
	hmacSecret: string;
}

export class WebhookVerifier implements IWebhookVerifier {
	constructor(
		private logger: Logger,
		private config: IWebhookVerifierConfig,
	) {}

	verifyPathSecret(pathSecret: string): boolean {
		if (this.config.pathSecret === "disabled") {
			this.logger.warn(
				"Webhook path secret is disabled — set PAYWALLO_WEBHOOK_PATH_SECRET in production",
			);
			return false;
		}

		const expected = Buffer.from(this.config.pathSecret);
		const provided = Buffer.from(pathSecret);

		if (expected.length !== provided.length) return false;
		return timingSafeEqual(expected, provided);
	}

	verifySignature(rawBody: string, signature: string | undefined): boolean {
		if (this.config.hmacSecret === "") {
			// HMAC desabilitado via env — fallback ao path secret apenas.
			return true;
		}

		if (!signature) {
			this.logger.warn("Webhook missing X-Paywallo-Signature header");
			return false;
		}

		const expected = `sha256=${createHmac("sha256", this.config.hmacSecret).update(rawBody).digest("hex")}`;

		const expectedBuf = Buffer.from(expected);
		const providedBuf = Buffer.from(signature);

		if (expectedBuf.length !== providedBuf.length) return false;
		return timingSafeEqual(expectedBuf, providedBuf);
	}
}

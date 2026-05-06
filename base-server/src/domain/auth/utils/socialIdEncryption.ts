import crypto from "crypto";

export function hashSocialId(socialId: string, provider: string): string {
	return crypto.createHash("sha256").update(`${provider}:${socialId}`).digest("hex");
}

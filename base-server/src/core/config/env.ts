import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
	NODE_ENV: z.enum(["staging", "production", "test"]).default("staging"),
	PORT: z.string().transform(Number).default("11000"),
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(32),
	JWT_EXPIRATION: z.string().default("365d"),
	RATE_LIMIT: z.string().transform(Number).default("40"),
	RATE_LIMIT_TIMEWINDOW: z.string().transform(Number).default("60000"),
	AUTH_RATE_LIMIT: z.coerce.number().int().positive().default(5),
	LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
	PAYWALLO_WEBHOOK_PATH_SECRET: z.string().min(1).default("disabled"),
	PAYWALLO_WEBHOOK_HMAC_SECRET: z.string().optional().default(""),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:");

	console.error(JSON.stringify(_env.error.format(), null, 2));
	process.exit(1);
}

export const env = _env.data;

export type Env = z.infer<typeof envSchema>;

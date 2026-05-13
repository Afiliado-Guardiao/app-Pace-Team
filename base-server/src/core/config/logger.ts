import winston from "winston";

import { winstonConfig } from "./logging/winston.config";

export class Logger {
	private logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger(winstonConfig);
	}

	private formatMessage(message: string, data?: Record<string, unknown>): string {
		if (!data || Object.keys(data).length === 0) return message;

		const details = Object.entries(data)
			.map(([key, value]) => `${key}: ${this.formatValue(value)}`)
			.join(" | ");

		return `${message} ${details}`;
	}

	private formatValue(value: unknown): string {
		if (value instanceof Error) {
			return `${value.name}: ${value.message}`;
		}
		if (typeof value === "object" && value !== null) {
			return JSON.stringify(value);
		}
		return String(value);
	}

	info(message: string, data?: Record<string, unknown>): void {
		this.logger.info(this.formatMessage(message, data));
	}

	error(message: string, errorOrData?: Error | Record<string, unknown>): void {
		if (errorOrData instanceof Error) {
			this.logger.error(this.formatMessage(message), {
				error: {
					message: errorOrData.message,
					stack: errorOrData.stack,
					name: errorOrData.name,
				},
			});
		} else {
			this.logger.error(this.formatMessage(message, errorOrData));
		}
	}

	warn(message: string, data?: Record<string, unknown>): void {
		this.logger.warn(this.formatMessage(message, data));
	}

	debug(message: string, data?: Record<string, unknown>): void {
		this.logger.debug(this.formatMessage(message, data));
	}
}

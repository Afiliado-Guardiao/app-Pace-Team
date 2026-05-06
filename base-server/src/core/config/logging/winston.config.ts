import winston from "winston";

import { env } from "@/core/config/env";

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	debug: "blue",
};

winston.addColors(colors);

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
} as const;

const formatTimestamp = (): string => {
	return new Date().toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 3,
	});
};

const baseFormat = winston.format.combine(
	winston.format.timestamp({
		format: formatTimestamp,
	}),
	winston.format.errors({ stack: true }),
);

const consoleFormat = winston.format.combine(
	baseFormat,
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info: {
			timestamp?: unknown;
			level?: unknown;
			message?: unknown;
			stack?: unknown;
			[key: string]: unknown;
		}) => {
			const { timestamp, level, message, stack, ...metadata } = info;
			let log = `${String(timestamp)} ${String(level)}: ${String(message)}`;
			if (Object.keys(metadata).length > 0) {
				log += ` ${JSON.stringify(metadata)}`;
			}
			if (stack && typeof stack === "string") {
				log += `\n${stack}`;
			}
			return log;
		},
	),
);

export const winstonConfig = {
	levels,
	format: baseFormat,
	transports: [
		new winston.transports.Console({
			level: env.LOG_LEVEL,
			format: consoleFormat,
			stderrLevels: ["error"],
			handleExceptions: true,
			handleRejections: true,
		}),
	],
	exitOnError: false,
	silent: env.NODE_ENV === "test",
};

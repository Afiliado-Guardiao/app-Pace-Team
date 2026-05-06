export const APPLE_AUTH_CONFIG = {
	SCOPES: {
		EMAIL: "email",
		FULL_NAME: "fullName",
	},
	OPERATION: {
		LOGIN: 1,
	},
	STATE: {
		AUTHORIZED: 1,
	},
	ERROR_CODES: {
		USER_CANCELLED: "1001",
	},
} as const;

import { ERROR_CODES, ErrorCode } from "@/lib/constants/errorCodes";

describe("ERROR_CODES", () => {
	it("contains all expected error codes", () => {
		expect(ERROR_CODES.EMAIL_ALREADY_EXISTS).toBe("EMAIL_ALREADY_EXISTS");
		expect(ERROR_CODES.INVALID_CREDENTIALS).toBe("INVALID_CREDENTIALS");
		expect(ERROR_CODES.USER_NOT_FOUND).toBe("USER_NOT_FOUND");
		expect(ERROR_CODES.INVALID_TOKEN).toBe("INVALID_TOKEN");
		expect(ERROR_CODES.UNAUTHORIZED).toBe("UNAUTHORIZED");
		expect(ERROR_CODES.UNAUTHORIZED_ACCESS).toBe("UNAUTHORIZED_ACCESS");
		expect(ERROR_CODES.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
		expect(ERROR_CODES.INTERNAL_SERVER_ERROR).toBe("INTERNAL_SERVER_ERROR");
		expect(ERROR_CODES.SUBSCRIPTION_REQUIRED).toBe("SUBSCRIPTION_REQUIRED");
		expect(ERROR_CODES.INVALID_PASSWORD).toBe("INVALID_PASSWORD");
		expect(ERROR_CODES.INVALID_USER_ID).toBe("INVALID_USER_ID");
		expect(ERROR_CODES.REFERRAL_CODE_ALREADY_EXISTS).toBe("REFERRAL_CODE_ALREADY_EXISTS");
		expect(ERROR_CODES.ONBOARDING_NOT_FOUND).toBe("ONBOARDING_NOT_FOUND");
		expect(ERROR_CODES.INVALID_ONBOARDING).toBe("INVALID_ONBOARDING");
		expect(ERROR_CODES.INVALID_WEBHOOK).toBe("INVALID_WEBHOOK");
		expect(ERROR_CODES.DUPLICATE_EVENT).toBe("DUPLICATE_EVENT");
		expect(ERROR_CODES.NETWORK_ERROR).toBe("NETWORK_ERROR");
		expect(ERROR_CODES.TIMEOUT_ERROR).toBe("TIMEOUT_ERROR");
	});

	it("each value matches its key", () => {
		Object.entries(ERROR_CODES).forEach(([key, value]) => {
			expect(value).toBe(key);
		});
	});

	it("has 18 error codes", () => {
		expect(Object.keys(ERROR_CODES)).toHaveLength(18);
	});
});

describe("ErrorCode type", () => {
	it("accepts known error code values at runtime", () => {
		const code: ErrorCode = ERROR_CODES.VALIDATION_ERROR;

		expect(typeof code).toBe("string");
	});
});

import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
	ApiError,
	AuthError,
	InvalidCredentialsError,
	NetworkError,
	ServerError,
	TimeoutError,
	UnauthorizedError,
	ValidationError,
} from "@/lib/errors/ApiError";

describe("ApiError", () => {
	it("creates with required properties", () => {
		const error = new ApiError("Something failed", "SOME_CODE", 422);

		expect(error.message).toBe("Something failed");
		expect(error.code).toBe("SOME_CODE");
		expect(error.statusCode).toBe(422);
		expect(error.name).toBe("ApiError");
	});

	it("defaults statusCode to 500", () => {
		const error = new ApiError("msg", "CODE");

		expect(error.statusCode).toBe(500);
	});

	it("accepts optional details", () => {
		const details = { field: "email" };
		const error = new ApiError("msg", "CODE", 400, details);

		expect(error.details).toEqual(details);
	});

	it("is an instance of Error", () => {
		const error = new ApiError("msg", "CODE");

		expect(error).toBeInstanceOf(Error);
	});
});

describe("NetworkError", () => {
	it("has correct defaults", () => {
		const error = new NetworkError();

		expect(error.name).toBe("NetworkError");
		expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
		expect(error.statusCode).toBe(0);
		expect(error.message).toBe("Network error. Please check your connection.");
	});

	it("accepts custom message", () => {
		const error = new NetworkError("Custom network message");

		expect(error.message).toBe("Custom network message");
	});

	it("is an instance of ApiError", () => {
		expect(new NetworkError()).toBeInstanceOf(ApiError);
	});
});

describe("ValidationError", () => {
	it("has correct defaults", () => {
		const error = new ValidationError();

		expect(error.name).toBe("ValidationError");
		expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
		expect(error.statusCode).toBe(400);
		expect(error.message).toBe("Validation error");
	});

	it("accepts field and fieldMessage", () => {
		const error = new ValidationError("Invalid email", "email", "Must be a valid email");

		expect(error.field).toBe("email");
		expect(error.fieldMessage).toBe("Must be a valid email");
		expect(error.message).toBe("Invalid email");
	});

	it("is an instance of ApiError", () => {
		expect(new ValidationError()).toBeInstanceOf(ApiError);
	});
});

describe("AuthError", () => {
	it("creates with message, code and statusCode", () => {
		const error = new AuthError("Not allowed", ERROR_CODES.UNAUTHORIZED, 403);

		expect(error.name).toBe("AuthError");
		expect(error.message).toBe("Not allowed");
		expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
		expect(error.statusCode).toBe(403);
	});

	it("defaults statusCode to 401", () => {
		const error = new AuthError("msg", "CODE");

		expect(error.statusCode).toBe(401);
	});

	it("is an instance of ApiError", () => {
		expect(new AuthError("msg", "CODE")).toBeInstanceOf(ApiError);
	});
});

describe("InvalidCredentialsError", () => {
	it("has correct defaults", () => {
		const error = new InvalidCredentialsError();

		expect(error.name).toBe("InvalidCredentialsError");
		expect(error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS);
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe("Invalid credentials");
	});

	it("accepts custom message", () => {
		const error = new InvalidCredentialsError("Wrong password");

		expect(error.message).toBe("Wrong password");
	});

	it("is an instance of AuthError and ApiError", () => {
		const error = new InvalidCredentialsError();

		expect(error).toBeInstanceOf(AuthError);
		expect(error).toBeInstanceOf(ApiError);
	});
});

describe("UnauthorizedError", () => {
	it("has correct defaults", () => {
		const error = new UnauthorizedError();

		expect(error.name).toBe("UnauthorizedError");
		expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe("Unauthorized access");
	});

	it("accepts custom message", () => {
		const error = new UnauthorizedError("Session expired");

		expect(error.message).toBe("Session expired");
	});

	it("is an instance of AuthError and ApiError", () => {
		const error = new UnauthorizedError();

		expect(error).toBeInstanceOf(AuthError);
		expect(error).toBeInstanceOf(ApiError);
	});
});

describe("ServerError", () => {
	it("has correct defaults", () => {
		const error = new ServerError();

		expect(error.name).toBe("ServerError");
		expect(error.code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR);
		expect(error.statusCode).toBe(500);
		expect(error.message).toBe("Server error. Please try again later.");
	});

	it("accepts custom message", () => {
		const error = new ServerError("Database down");

		expect(error.message).toBe("Database down");
	});

	it("is an instance of ApiError", () => {
		expect(new ServerError()).toBeInstanceOf(ApiError);
	});
});

describe("TimeoutError", () => {
	it("has correct defaults", () => {
		const error = new TimeoutError();

		expect(error.name).toBe("TimeoutError");
		expect(error.code).toBe(ERROR_CODES.TIMEOUT_ERROR);
		expect(error.statusCode).toBe(408);
		expect(error.message).toBe("Request timeout. Please try again.");
	});

	it("accepts custom message", () => {
		const error = new TimeoutError("Took too long");

		expect(error.message).toBe("Took too long");
	});

	it("is an instance of ApiError", () => {
		expect(new TimeoutError()).toBeInstanceOf(ApiError);
	});
});

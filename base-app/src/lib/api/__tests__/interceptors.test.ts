import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
	InvalidCredentialsError,
	NetworkError,
	ServerError,
	TimeoutError,
	UnauthorizedError,
	ValidationError,
} from "@/lib/errors/ApiError";

jest.mock("@/lib/api/client", () => ({
	apiClient: {
		interceptors: {
			request: { use: jest.fn() },
			response: { use: jest.fn() },
		},
	},
}));

jest.mock("@/store", () => ({
	useStore: {
		getState: jest.fn(),
	},
}));

import { useStore } from "@/store";
import { apiClient } from "@/lib/api/client";
import { setupInterceptors } from "@/lib/api/interceptors";

const mockUseStore = useStore as jest.Mocked<typeof useStore>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

let requestHandler: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
let requestErrorHandler: (error: AxiosError) => Promise<AxiosError>;
let responseHandler: (response: unknown) => unknown;
let responseErrorHandler: (error: AxiosError) => Promise<Error>;

beforeAll(() => {
	setupInterceptors();

	const requestUseMock = mockApiClient.interceptors.request.use as jest.Mock;
	const responseUseMock = mockApiClient.interceptors.response.use as jest.Mock;

	[requestHandler, requestErrorHandler] = requestUseMock.mock.calls[0];
	[responseHandler, responseErrorHandler] = responseUseMock.mock.calls[0];
});

const makeAxiosError = (
	overrides: Partial<{
		code: string;
		message: string;
		status: number;
		data: unknown;
	}> = {},
): AxiosError => {
	const error = new AxiosError(overrides.message ?? "Request failed", overrides.code, {
		url: "/test",
		method: "get",
	} as InternalAxiosRequestConfig);

	if (overrides.status !== undefined) {
		error.response = {
			status: overrides.status,
			statusText: "Error",
			data: overrides.data ?? {},
			headers: {},
			config: {} as InternalAxiosRequestConfig,
		} as AxiosError["response"];
	}

	return error;
};

describe("setupInterceptors", () => {
	it("registers request and response interceptors on apiClient", () => {
		expect(mockApiClient.interceptors.request.use).toHaveBeenCalledTimes(1);
		expect(mockApiClient.interceptors.response.use).toHaveBeenCalledTimes(1);
	});
});

describe("request interceptor", () => {
	it("attaches Bearer token when store has a token", () => {
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: "abc123", logout: jest.fn() });

		const config = { headers: {} } as InternalAxiosRequestConfig;
		const result = requestHandler(config);

		expect(result.headers.Authorization).toBe("Bearer abc123");
	});

	it("does not set Authorization header when token is absent", () => {
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: null, logout: jest.fn() });

		const config = { headers: {} } as InternalAxiosRequestConfig;
		const result = requestHandler(config);

		expect(result.headers.Authorization).toBeUndefined();
	});

	it("passes request errors through", async () => {
		const error = new AxiosError("Network failure");

		await expect(requestErrorHandler(error)).rejects.toBe(error);
	});
});

describe("response interceptor", () => {
	it("passes successful responses through unchanged", () => {
		const response = { data: { id: 1 }, status: 200 };

		expect(responseHandler(response)).toBe(response);
	});
});

describe("response error interceptor", () => {
	beforeEach(() => {
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: null, logout: jest.fn() });
		jest.clearAllMocks();
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: null, logout: jest.fn() });
	});

	it("rejects with TimeoutError on ECONNABORTED", async () => {
		const error = makeAxiosError({ code: "ECONNABORTED" });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(TimeoutError);
	});

	it("rejects with TimeoutError when message contains 'timeout'", async () => {
		const error = makeAxiosError({ message: "timeout of 5000ms exceeded" });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(TimeoutError);
	});

	it("rejects with NetworkError on ERR_NETWORK", async () => {
		const error = makeAxiosError({ code: "ERR_NETWORK" });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(NetworkError);
	});

	it("rejects with NetworkError when response is absent", async () => {
		const error = new AxiosError("Network Error");

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(NetworkError);
	});

	it("rejects with InvalidCredentialsError on 401 with INVALID_CREDENTIALS code", async () => {
		const logout = jest.fn();
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: null, logout });

		const error = makeAxiosError({
			status: 401,
			data: { error: ERROR_CODES.INVALID_CREDENTIALS, message: "Wrong password" },
		});

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(InvalidCredentialsError);
		expect(logout).toHaveBeenCalled();
	});

	it("rejects with UnauthorizedError on generic 401", async () => {
		const logout = jest.fn();
		(mockUseStore.getState as jest.Mock).mockReturnValue({ token: null, logout });

		const error = makeAxiosError({ status: 401, data: { message: "Token expired" } });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(UnauthorizedError);
		expect(logout).toHaveBeenCalled();
	});

	it("rejects with ValidationError on 400 with VALIDATION_ERROR code", async () => {
		const error = makeAxiosError({
			status: 400,
			data: {
				error: ERROR_CODES.VALIDATION_ERROR,
				message: "Email is invalid",
				field: "email",
				fieldMessage: "Must be a valid email address",
			},
		});

		const rejection = await responseErrorHandler(error).catch((e) => e);

		expect(rejection).toBeInstanceOf(ValidationError);
		expect(rejection.field).toBe("email");
		expect(rejection.fieldMessage).toBe("Must be a valid email address");
	});

	it("rejects with ServerError on status >= 500", async () => {
		const error = makeAxiosError({ status: 500, data: { message: "Internal server error" } });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(ServerError);
	});

	it("rejects with ServerError on status 503", async () => {
		const error = makeAxiosError({ status: 503 });

		await expect(responseErrorHandler(error)).rejects.toBeInstanceOf(ServerError);
	});

	it("passes through unhandled errors (e.g. 404)", async () => {
		const error = makeAxiosError({ status: 404, data: { message: "Not found" } });

		await expect(responseErrorHandler(error)).rejects.toBe(error);
	});
});

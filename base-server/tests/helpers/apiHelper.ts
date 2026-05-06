interface TestResponse {
	statusCode: number;
	body: unknown;
	headers: Record<string, string | string[]>;
}

export function expectSuccess(response: TestResponse): void {
	if (response.statusCode < 200 || response.statusCode >= 300) {
		throw new Error(
			`Expected success status (2xx), got ${response.statusCode}: ${JSON.stringify(response.body)}`,
		);
	}
}

export function expectError(response: TestResponse, expectedStatus: number): void {
	if (response.statusCode !== expectedStatus) {
		throw new Error(
			`Expected status ${expectedStatus}, got ${response.statusCode}: ${JSON.stringify(response.body)}`,
		);
	}
}

export function expectValidationError(response: TestResponse): void {
	expectError(response, 400);
}

export function expectUnauthorized(response: TestResponse): void {
	expectError(response, 401);
}

export function expectForbidden(response: TestResponse): void {
	expectError(response, 403);
}

export function expectNotFound(response: TestResponse): void {
	expectError(response, 404);
}

export function expectConflict(response: TestResponse): void {
	expectError(response, 409);
}

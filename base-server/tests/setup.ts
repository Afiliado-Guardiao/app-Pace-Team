import "reflect-metadata";

import { clearDatabase, setupDatabase, teardownDatabase } from "./helpers/database";
import { closeTestServer, createTestServer } from "./helpers/testServer";

// Env vars são setadas em tests/setup-env.js (via jest.config.js setupFiles)
// que roda ANTES de qualquer import de módulo, garantindo que @/core/config/env
// leia os valores de teste no momento do import.

jest.mock("i18next-fs-backend", () => jest.fn());

jest.mock("@/core/i18n", () => {
	type MockI18n = {
		t: jest.Mock;
		changeLanguage: jest.Mock;
		cloneInstance: jest.Mock;
		use: jest.Mock;
		init: jest.Mock;
	};

	const mockI18n: MockI18n = {
		t: jest.fn((key: string, options?: { defaultValue?: string }) => {
			return (options && options.defaultValue) || key;
		}),
		changeLanguage: jest.fn().mockResolvedValue(undefined),
		cloneInstance: jest.fn((): MockI18n => mockI18n),
		use: jest.fn().mockReturnThis(),
		init: jest.fn().mockResolvedValue(undefined),
	};

	return {
		initializeI18n: jest.fn().mockResolvedValue(mockI18n),
		detectLanguageFromHeader: jest.fn(() => "pt-BR"),
		i18next: mockI18n,
	};
});

beforeAll(async () => {
	await setupDatabase();

	await createTestServer();
}, 60000);

afterAll(async () => {
	await closeTestServer();

	await teardownDatabase();
}, 30000);

beforeEach(async () => {
	await clearDatabase();
});


import { emailLoginSchema, emailRegisterSchema } from "../schemas";

describe("Auth Validation Schemas", () => {
	describe("emailLoginSchema", () => {
		it("should validate correct login data", () => {
			const validData = {
				email: "test@example.com",
				password: "password123",
			};

			const result = emailLoginSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject invalid email", () => {
			const invalidData = {
				email: "invalid-email",
				password: "password123",
			};

			const result = emailLoginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject empty password", () => {
			const invalidData = {
				email: "test@example.com",
				password: "",
			};

			const result = emailLoginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe("emailRegisterSchema", () => {
		it("should validate correct registration data", () => {
			const validData = {
				name: "John Doe",
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			const result = emailRegisterSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should reject password shorter than 8 characters", () => {
			const invalidData = {
				name: "John Doe",
				email: "test@example.com",
				password: "pass",
				confirmPassword: "pass",
			};

			const result = emailRegisterSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject when passwords do not match", () => {
			const invalidData = {
				name: "John Doe",
				email: "test@example.com",
				password: "password123",
				confirmPassword: "different123",
			};

			const result = emailRegisterSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject empty name", () => {
			const invalidData = {
				name: "",
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			const result = emailRegisterSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});

import { zodErrorToI18nKey } from "../zodErrorToI18nKey";

describe("zodErrorToI18nKey", () => {
	describe("required / obrigatório errors", () => {
		it("maps 'required' + email field to emailRequired", () => {
			expect(zodErrorToI18nKey("Required", "email")).toBe("validation:emailRequired");
		});

		it("maps 'obrigatório' + email field to emailRequired (pt-BR)", () => {
			expect(zodErrorToI18nKey("Campo obrigatório", "email")).toBe("validation:emailRequired");
		});

		it("maps 'required' + password field to passwordRequired", () => {
			expect(zodErrorToI18nKey("required field", "password")).toBe("validation:passwordRequired");
		});

		it("maps 'required' + name field to nameRequired", () => {
			expect(zodErrorToI18nKey("required", "name")).toBe("validation:nameRequired");
		});

		it("maps 'required' + confirmPassword field to confirmPasswordRequired", () => {
			expect(zodErrorToI18nKey("required", "confirmPassword")).toBe(
				"validation:confirmPasswordRequired",
			);
		});

		it("maps 'required' + currentPassword field to currentPasswordRequired", () => {
			expect(zodErrorToI18nKey("required", "currentPassword")).toBe(
				"validation:currentPasswordRequired",
			);
		});

		it("maps 'required' + newPassword field to newPasswordRequired", () => {
			expect(zodErrorToI18nKey("required", "newPassword")).toBe(
				"validation:newPasswordRequired",
			);
		});

		it("is case-insensitive for field names (UPPERCASE)", () => {
			expect(zodErrorToI18nKey("required", "EMAIL")).toBe("validation:emailRequired");
		});
	});

	describe("invalid / inválido errors", () => {
		it("maps 'invalid' + email field to emailInvalid", () => {
			expect(zodErrorToI18nKey("Invalid email", "email")).toBe("validation:emailInvalid");
		});

		it("maps 'inválido' + email field to emailInvalid (pt-BR)", () => {
			expect(zodErrorToI18nKey("E-mail inválido", "email")).toBe("validation:emailInvalid");
		});

		it("does not map 'invalid' for non-email fields (fallback to raw message)", () => {
			const result = zodErrorToI18nKey("Invalid value", "name");
			expect(result).toBe("Invalid value");
		});
	});

	describe("min length errors (8 characters)", () => {
		it("maps '8 characters' + password field to passwordMinLength", () => {
			expect(zodErrorToI18nKey("String must contain at least 8 character(s)", "password")).toBe(
				"validation:passwordMinLength",
			);
		});

		it("maps '8 characters' + newPassword field to newPasswordMinLength", () => {
			expect(zodErrorToI18nKey("Must be at least 8 characters", "newPassword")).toBe(
				"validation:newPasswordMinLength",
			);
		});

		it("does not match length key when '8' and 'character' are absent", () => {
			const result = zodErrorToI18nKey("Too short", "password");
			expect(result).toBe("Too short");
		});
	});

	describe("passwords mismatch errors", () => {
		it("maps 'não coincidem' to passwordsMismatch (pt-BR)", () => {
			expect(zodErrorToI18nKey("Passwords não coincidem", "confirmPassword")).toBe(
				"validation:passwordsMismatch",
			);
		});

		it("maps 'not match' to passwordsMismatch (en)", () => {
			expect(zodErrorToI18nKey("Passwords do not match", "confirmPassword")).toBe(
				"validation:passwordsMismatch",
			);
		});

		it("maps mismatch regardless of field name", () => {
			expect(zodErrorToI18nKey("Values not match", "someField")).toBe(
				"validation:passwordsMismatch",
			);
		});
	});

	describe("fallback behavior", () => {
		it("returns the original message when no pattern matches", () => {
			expect(zodErrorToI18nKey("Something went wrong", "name")).toBe("Something went wrong");
		});

		it("returns empty string as-is when message is empty", () => {
			expect(zodErrorToI18nKey("", "email")).toBe("");
		});

		it("returns message as-is for unknown fields with no matching pattern", () => {
			expect(zodErrorToI18nKey("Some error", "unknownField")).toBe("Some error");
		});
	});
});

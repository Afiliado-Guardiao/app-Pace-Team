export const zodErrorToI18nKey = (errorMessage: string, fieldName: string): string => {
	const lowerError = errorMessage.toLowerCase();
	const lowerField = fieldName.toLowerCase();

	if (lowerError.includes("required") || lowerError.includes("obrigatório")) {
		if (lowerField === "email") return "validation:emailRequired";
		if (lowerField === "password") return "validation:passwordRequired";
		if (lowerField === "name") return "validation:nameRequired";
		if (lowerField === "confirmpassword") return "validation:confirmPasswordRequired";
		if (lowerField === "currentpassword") return "validation:currentPasswordRequired";
		if (lowerField === "newpassword") return "validation:newPasswordRequired";
	}

	if (lowerError.includes("invalid") || lowerError.includes("inválido")) {
		if (lowerField === "email") return "validation:emailInvalid";
	}

	if (lowerError.includes("8") && lowerError.includes("character")) {
		if (lowerField === "password") return "validation:passwordMinLength";
		if (lowerField === "newpassword") return "validation:newPasswordMinLength";
	}

	if (lowerError.includes("não coincidem") || lowerError.includes("not match")) {
		return "validation:passwordsMismatch";
	}

	return errorMessage;
};

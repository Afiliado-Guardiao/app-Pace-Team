import enUSAuth from "./en-US/auth.json";
import enUSCommon from "./en-US/common.json";
import enUSErrors from "./en-US/errors.json";
import enUSHome from "./en-US/home.json";
import enUSOnboarding from "./en-US/onboarding.json";
import enUSProfile from "./en-US/profile.json";
import enUSValidation from "./en-US/validation.json";
import enUSWelcome from "./en-US/welcome.json";
import esESAuth from "./es-ES/auth.json";
import esESCommon from "./es-ES/common.json";
import esESErrors from "./es-ES/errors.json";
import esESHome from "./es-ES/home.json";
import esESOnboarding from "./es-ES/onboarding.json";
import esESProfile from "./es-ES/profile.json";
import esESValidation from "./es-ES/validation.json";
import esESWelcome from "./es-ES/welcome.json";
import ptBRAuth from "./pt-BR/auth.json";
import ptBRCommon from "./pt-BR/common.json";
import ptBRErrors from "./pt-BR/errors.json";
import ptBRHome from "./pt-BR/home.json";
import ptBROnboarding from "./pt-BR/onboarding.json";
import ptBRProfile from "./pt-BR/profile.json";
import ptBRValidation from "./pt-BR/validation.json";
import ptBRWelcome from "./pt-BR/welcome.json";

export const resources = {
	"pt-BR": {
		common: ptBRCommon,
		welcome: ptBRWelcome,
		onboarding: ptBROnboarding,
		auth: ptBRAuth,
		profile: ptBRProfile,
		home: ptBRHome,
		validation: ptBRValidation,
		errors: ptBRErrors,
	},
	"en-US": {
		common: enUSCommon,
		welcome: enUSWelcome,
		onboarding: enUSOnboarding,
		auth: enUSAuth,
		profile: enUSProfile,
		home: enUSHome,
		validation: enUSValidation,
		errors: enUSErrors,
	},
	"es-ES": {
		common: esESCommon,
		welcome: esESWelcome,
		onboarding: esESOnboarding,
		auth: esESAuth,
		profile: esESProfile,
		home: esESHome,
		validation: esESValidation,
		errors: esESErrors,
	},
};

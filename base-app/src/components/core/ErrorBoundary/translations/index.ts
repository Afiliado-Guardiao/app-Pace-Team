export type IErrorBoundaryLocale = "pt-BR" | "en-US" | "es-ES";

export interface IErrorBoundaryTranslation {
	title: string;
	message: string;
	button: string;
}

export const errorBoundaryTranslations: Record<IErrorBoundaryLocale, IErrorBoundaryTranslation> = {
	"pt-BR": {
		title: "Oops! Algo deu errado",
		message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
		button: "Tentar Novamente",
	},
	"en-US": {
		title: "Oops! Something went wrong",
		message: "An unexpected error occurred. Please try again.",
		button: "Try Again",
	},
	"es-ES": {
		title: "¡Ups! Algo salió mal",
		message: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
		button: "Reintentar",
	},
};

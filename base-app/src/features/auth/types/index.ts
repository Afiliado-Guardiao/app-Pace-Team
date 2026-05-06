import { IErrorModalData } from "@/components/ui/ErrorModal/hooks/useErrorModal";
import { IUser } from "@/store";

export interface IAuthScreenData {
	isLoading: boolean;
	isAppleAuthAvailable: boolean;
	handleAppleSignIn: () => Promise<void>;
	handleGoogleSignIn: () => Promise<void>;
	isEmailModalVisible: boolean;
	openEmailModal: () => void;
	closeEmailModal: () => void;
	handleEmailAuthSuccess: () => void;
	errorModal: IErrorModalData;
	hideError: () => void;
}

export interface IAuthBackData {
	handleBack: () => void;
}

export interface ILoginResponse {
	user: IUser;
	token: string;
}

export interface ILoginRequest {
	identityToken: string;
	authorizationCode: string;
	user: string;
	email?: string | null;
	fullName?: {
		givenName: string | null;
		familyName: string | null;
	} | null;
}

export interface IApiError {
	message?: string;
}

export interface IEmailAuthFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface IEmailAuthErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export interface IEmailAuthModalData {
	authMode: "login" | "register";
	formValues: IEmailAuthFormValues;
	errors: IEmailAuthErrors;
	isLoading: boolean;
	handleInputChange: (field: keyof IEmailAuthFormValues, value: string) => void;
	handleSubmit: () => void;
	toggleAuthMode: () => void;
}

export interface IRegisterRequest {
	name: string;
	email: string;
	password: string;
	onboardingId: string;
	referralCode?: string;
}

export interface IEmailLoginRequest {
	email: string;
	password: string;
}

export interface IEmailAuthResponse {
	user: IUser;
	token: string;
}

export interface IGoogleLoginRequest {
	idToken: string;
}

export interface ISocialLoginRequest {
	socialId: string;
	socialProvider: "APPLE" | "GOOGLE";
	email?: string | null;
	name?: string | null;
	onboardingId?: string;
	referralCode?: string;
}

export type { IEmailLoginSchema, IEmailRegisterSchema } from "../validation/schemas";

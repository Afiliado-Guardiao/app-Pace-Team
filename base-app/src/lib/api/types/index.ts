export interface IApiResponse<T = unknown> {
	data: T;
	message?: string;
	status: number;
}

export interface IApiError {
	message: string;
	status?: number;
	code?: string;
}

export interface IApiConfig {
	baseURL: string;
	timeout: number;
	headers: Record<string, string>;
}

export interface IUser {
	id: string;
	email: string | null;
	name: string;
	birthday?: string | null;
	referralCode: string;
	createdAt: string;
}

export interface IAuthResponse {
	user: IUser;
	token: string;
}

export interface IOnboarding {
	id: string;
	anonymousUserId?: string | null;
	userId?: string | null;
	name?: string | null;
	email?: string | null;
	birthday?: string | null;
	completed: boolean;
	completedAt?: string | null;
}

export interface IReferralStats {
	myCode: string;
	usedCode: string | null;
	referralsCount: number;
}

export interface IApplyReferralResponse {
	usedCode: string;
	referrer: { name: string };
}

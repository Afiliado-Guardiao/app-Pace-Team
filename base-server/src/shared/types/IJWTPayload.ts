export interface IJWTPayload {
	userId: string;
	email: string | null;
	name: string;
	referralCode: string;
	loginVersion: number;
	iat: number;
	exp: number;
}

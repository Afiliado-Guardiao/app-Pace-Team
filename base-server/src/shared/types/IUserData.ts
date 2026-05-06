export interface IUserData {
	id: string;
	email: string | null;
	name: string;
	birthday: string | null;
	passwordHash: string | null;
	socialId: string | null;
	socialProvider: string | null;
	referralCode: string;
	referredByCode: string | null;
	loginVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

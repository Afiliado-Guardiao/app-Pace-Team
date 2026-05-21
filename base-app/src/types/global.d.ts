declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";
declare module "*.json";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			EXPO_PUBLIC_SUPABASE_URL?: string;
			EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
			EXPO_PUBLIC_PAYWALLO_APP_KEY?: string;
			EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?: string;
			EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?: string;
		}
	}
}

export {};

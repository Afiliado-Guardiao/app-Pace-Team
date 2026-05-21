import { useState } from "react";

import { useRouter } from "expo-router";

import { signInWithEmail, signUpWithEmail } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

interface IUseDebugLoginReturn {
	isLoading: boolean;
	handleDebugLogin: () => Promise<void>;
}

const DEBUG_EMAIL = "debug.claude@teste.com";
const DEBUG_PASSWORD = "DebugPass123!";
const DEBUG_NAME = "Debug Claude";

export const useDebugLogin = (): IUseDebugLoginReturn => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleDebugLogin = async (): Promise<void> => {
		setIsLoading(true);
		try {
			try {
				await signInWithEmail({ email: DEBUG_EMAIL, password: DEBUG_PASSWORD });
			} catch {
				await signUpWithEmail({
					email: DEBUG_EMAIL,
					password: DEBUG_PASSWORD,
					name: DEBUG_NAME,
				});
			}
			router.replace(ROUTES.HOME);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleDebugLogin };
};

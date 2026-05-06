import { useState } from "react";

import { useRouter } from "expo-router";

import { authApi } from "@/lib/api/auth";
import { useStore } from "@/store";
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
	const login = useStore((state) => state.login);

	const handleDebugLogin = async (): Promise<void> => {
		setIsLoading(true);
		try {
			let response;
			try {
				response = await authApi.login({ email: DEBUG_EMAIL, password: DEBUG_PASSWORD });
			} catch {
				response = await authApi.register({
					email: DEBUG_EMAIL,
					password: DEBUG_PASSWORD,
					name: DEBUG_NAME,
				});
			}
			login(response.user, response.token);
			router.replace(ROUTES.HOME);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleDebugLogin };
};

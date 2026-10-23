import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { authErrorMessage } from "@/lib/auth/authErrors";
import { signUpWithEmail } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { CITIES, SIGNUP_TOASTS, STATES } from "../constants";
import { ISignupErrors, ISignupForm, maskBirthday, toIsoDate, validateSignup } from "../validation";

interface IUseSignupScreenReturn {
	form: ISignupForm;
	errors: ISignupErrors;
	accepted: boolean;
	isLoading: boolean;
	toast: IFloatingToastData | null;
	setField: (field: keyof ISignupForm, value: string) => void;
	setAccepted: (value: boolean) => void;
	handleSubmit: () => void;
	handlePhoto: () => void;
	handleBack: () => void;
}

const INITIAL: ISignupForm = {
	name: "",
	email: "",
	password: "",
	birthday: "",
	city: CITIES[0] ?? "",
	state: STATES[0] ?? "",
};

// Cadastro no Supabase (converte a sessão anônima). Depois leva à aba Equipe,
// no estado "sem time", para criar ou entrar numa equipe.
export const useSignupScreen = (): IUseSignupScreenReturn => {
	const router = useRouter();
	const setHasTeam = useStore((state) => state.setHasTeam);
	const { toast, showToast } = useFloatingToast();
	const [form, setForm] = useState<ISignupForm>(INITIAL);
	const [errors, setErrors] = useState<ISignupErrors>({});
	const [accepted, setAccepted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const setField = useCallback((field: keyof ISignupForm, value: string) => {
		setForm((current) => ({
			...current,
			[field]: field === "birthday" ? maskBirthday(value) : value,
		}));
	}, []);

	const handleSubmit = useCallback(() => {
		const found = validateSignup(form);
		setErrors(found);
		if (Object.keys(found).length > 0 || !accepted || isLoading) return;
		setIsLoading(true);
		signUpWithEmail({
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
			birthday: toIsoDate(form.birthday),
			city: form.city,
			state: form.state,
		})
			.then(() => {
				setHasTeam(false);
				router.replace(ROUTES.TEAM);
			})
			.catch((error: unknown) => {
				showToast({ ...SIGNUP_TOASTS.error, message: authErrorMessage(error) });
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [form, accepted, isLoading, router, setHasTeam, showToast]);

	const handlePhoto = useCallback(() => {
		showToast(SIGNUP_TOASTS.photo);
	}, [showToast]);

	const handleBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.LOGIN);
	}, [router]);

	return {
		form,
		errors,
		accepted,
		isLoading,
		toast,
		setField,
		setAccepted,
		handleSubmit,
		handlePhoto,
		handleBack,
	};
};

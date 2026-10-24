import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { authErrorMessage } from "@/lib/auth/authErrors";
import { resetPasswordWithCode, sendPasswordReset } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { RESET_COPY } from "../constants";

export type IResetStep = "email" | "code";

interface IUseResetPasswordReturn {
	isOpen: boolean;
	step: IResetStep;
	email: string;
	code: string;
	newPassword: string;
	error: string | null;
	isBusy: boolean;
	open: (prefillEmail: string) => void;
	close: () => void;
	setEmail: (value: string) => void;
	setCode: (value: string) => void;
	setNewPassword: (value: string) => void;
	sendCode: () => void;
	confirm: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6,8}$/;
const MIN_PASSWORD = 8;

// "Esqueci minha senha": e-mail → código de 6 dígitos + senha nova → logado.
export const useResetPassword = (): IUseResetPasswordReturn => {
	const router = useRouter();
	const setHasTeam = useStore((state) => state.setHasTeam);
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<IResetStep>("email");
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isBusy, setIsBusy] = useState(false);

	const open = useCallback((prefillEmail: string) => {
		setEmail(prefillEmail.trim());
		setCode("");
		setNewPassword("");
		setError(null);
		setStep("email");
		setIsOpen(true);
	}, []);

	const sendCode = useCallback(() => {
		const target = email.trim();
		if (!EMAIL_RE.test(target)) {
			setError(RESET_COPY.emailInvalid);
			return;
		}
		setIsBusy(true);
		setError(null);
		sendPasswordReset(target)
			.then(() => {
				setStep("code");
			})
			.catch((e: unknown) => {
				setError(authErrorMessage(e));
			})
			.finally(() => {
				setIsBusy(false);
			});
	}, [email]);

	const confirm = useCallback(() => {
		const token = code.replace(/\s/g, "");
		const invalid = CODE_RE.test(token) ? null : RESET_COPY.codeInvalid;
		const short = newPassword.length < MIN_PASSWORD ? RESET_COPY.passwordShort : null;
		if (invalid ?? short) {
			setError(invalid ?? short);
			return;
		}
		setIsBusy(true);
		setError(null);
		resetPasswordWithCode({ email: email.trim(), code: token, newPassword })
			.then(() => {
				setIsOpen(false);
				setHasTeam(true);
				router.replace(ROUTES.HOME);
			})
			.catch((e: unknown) => {
				setError(authErrorMessage(e));
			})
			.finally(() => {
				setIsBusy(false);
			});
	}, [code, email, newPassword, router, setHasTeam]);

	return {
		isOpen,
		step,
		email,
		code,
		newPassword,
		error,
		isBusy,
		open,
		close: () => {
			setIsOpen(false);
		},
		setEmail: (value) => {
			setError(null);
			setEmail(value);
		},
		setCode: (value) => {
			setError(null);
			setCode(value);
		},
		setNewPassword: (value) => {
			setError(null);
			setNewPassword(value);
		},
		sendCode,
		confirm,
	};
};

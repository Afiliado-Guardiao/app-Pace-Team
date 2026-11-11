import { useState } from "react";

import { IFloatingToastData } from "@/components/pace";
import { useAthleteSearch } from "@/lib/data";
import { updateProfile } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { SETUP_COPY, SETUP_KEYS } from "../constants";

interface IUseStepProfileReturn {
	name: string;
	handle: string;
	bubble: string;
	// null = ainda não dá para dizer; true/false = livre ou já em uso
	isFree: boolean | null;
	isValid: boolean;
	isBusy: boolean;
	setName: (value: string) => void;
	setHandle: (value: string) => void;
	submit: () => void;
}

const HANDLE = /^[a-z0-9._]{3,20}$/;
const firstName = (name: string): string => name.trim().split(" ")[0] ?? "";
const slug = (name: string): string =>
	name
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9._]/g, "")
		.slice(0, 20);

// 02 · "Crie sua conta": nome (o Buddy responde "Prazer, …!") e @usuário
export const useStepProfile = (
	onDone: () => void,
	showToast: (t: IFloatingToastData) => void,
): IUseStepProfileReturn => {
	const user = useStore((s) => s.user);
	const setAnswer = useStore((s) => s.setAnswer);
	const [name, setNameState] = useState(user?.name ?? "");
	const [handle, setHandleState] = useState(user?.handle ?? "");
	const [isBusy, setIsBusy] = useState(false);
	const isHandleOk = HANDLE.test(handle);
	const { athletes } = useAthleteSearch(isHandleOk ? handle : "");
	const isTaken = athletes.some((a) => a.handle.replace(/^@/, "") === handle && a.id !== user?.id);
	const first = firstName(name);

	return {
		name,
		handle,
		bubble: first.length >= 2 ? `Prazer, ${first}!` : SETUP_COPY.profileBubble,
		isFree: isHandleOk ? !isTaken : null,
		isValid: name.trim().length >= 2 && isHandleOk && !isTaken,
		isBusy,
		setName: (value) => {
			setNameState(value);
			// Sugere o @ a partir do nome enquanto o atleta não mexe nele
			if (!handle || handle === slug(name)) setHandleState(slug(value));
		},
		setHandle: (value) => {
			setHandleState(
				value
					.toLowerCase()
					.replace(/[^a-z0-9._]/g, "")
					.slice(0, 20),
			);
		},
		submit: () => {
			setAnswer(SETUP_KEYS.name, name.trim());
			setAnswer(SETUP_KEYS.handle, handle);
			if (IS_PREVIEW) {
				onDone();
				return;
			}
			setIsBusy(true);
			updateProfile({ name: name.trim(), handle })
				.then(onDone)
				.catch(() => {
					showToast({ tone: "danger", title: SETUP_COPY.profileTaken });
				})
				.finally(() => {
					setIsBusy(false);
				});
		},
	};
};

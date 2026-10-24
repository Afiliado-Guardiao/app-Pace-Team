import { useCallback, useState } from "react";

import { IFloatingToastData } from "@/components/pace";
import { IPrivacySettings, updateProfile } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { DEFAULT_PRIVACY, PRIVACY_COPY } from "../constants";

interface IUsePrivacyReturn {
	isOpen: boolean;
	isSaving: boolean;
	values: IPrivacySettings;
	open: () => void;
	close: () => void;
	toggle: (key: keyof IPrivacySettings, value: boolean) => void;
	save: () => void;
}

// Folha "Privacidade": carrega do perfil, muda localmente e salva no servidor.
export const usePrivacy = (showToast: (toast: IFloatingToastData) => void): IUsePrivacyReturn => {
	const saved = useStore((s) => s.user?.privacy);
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [values, setValues] = useState<IPrivacySettings>(DEFAULT_PRIVACY);

	const open = useCallback(() => {
		setValues({ ...DEFAULT_PRIVACY, ...saved });
		setIsOpen(true);
	}, [saved]);

	const save = useCallback(() => {
		if (IS_PREVIEW) {
			setIsOpen(false);
			return;
		}
		setIsSaving(true);
		void updateProfile({ privacy: values })
			.then(() => {
				setIsOpen(false);
				showToast(PRIVACY_COPY.saved);
			})
			.catch(() => {
				showToast(PRIVACY_COPY.error);
			})
			.finally(() => {
				setIsSaving(false);
			});
	}, [values, showToast]);

	return {
		isOpen,
		isSaving,
		values,
		open,
		close: () => {
			setIsOpen(false);
		},
		toggle: (key, value) => {
			setValues((v) => ({ ...v, [key]: value }));
		},
		save,
	};
};

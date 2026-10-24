import { useCallback, useState } from "react";

import { IFloatingToastData } from "@/components/pace";
import { pickFromGallery } from "@/lib/media";
import { CITIES, STATES } from "@/lib/pace";
import { updateProfile, uploadAvatar } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { EDIT_COPY } from "../constants";

interface IEditForm {
	name: string;
	handle: string;
	city: string;
	state: string;
}

interface IUseEditProfileReturn {
	isOpen: boolean;
	isSaving: boolean;
	form: IEditForm;
	// Foto escolhida agora (antes de salvar) ou a atual do perfil
	photo: string | null;
	error: string | null;
	cityOptions: string[];
	stateOptions: string[];
	open: () => void;
	close: () => void;
	setField: (field: keyof IEditForm, value: string) => void;
	pickPhoto: () => void;
	save: () => void;
}

const HANDLE_RE = /^[a-z0-9._]{3,20}$/;
const MIN_NAME = 2;

// "@Ana.Corre " → "ana.corre"
const cleanHandle = (value: string): string => value.trim().replace(/^@/, "").toLowerCase();

const saveErrorMessage = (error: unknown): string => {
	const text = error instanceof Error ? error.message : String(error);
	if (text.includes("profiles_handle_key") || text.includes("duplicate"))
		return EDIT_COPY.handleTaken;
	if (text.includes("profiles_handle_format")) return EDIT_COPY.handleInvalid;
	return EDIT_COPY.saveError;
};

// "Editar perfil": nome, @, cidade/estado e foto da galeria.
export const useEditProfile = (
	showToast: (toast: IFloatingToastData) => void,
): IUseEditProfileReturn => {
	const user = useStore((s) => s.user);
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [form, setForm] = useState<IEditForm>({ name: "", handle: "", city: "", state: "" });
	const [pickedUri, setPickedUri] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const open = useCallback(() => {
		setForm({
			name: user?.name ?? "",
			handle: user?.handle ?? "",
			city: user?.city ?? CITIES.at(0) ?? "",
			state: user?.state ?? STATES.at(0) ?? "",
		});
		setPickedUri(null);
		setError(null);
		setIsOpen(true);
	}, [user]);

	const pickPhoto = useCallback(() => {
		void pickFromGallery({ isSquare: true }).then((result) => {
			if (result.status === "picked") setPickedUri(result.uri);
			if (result.status === "denied") showToast(EDIT_COPY.galleryDenied);
		});
	}, [showToast]);

	const save = useCallback(() => {
		const handle = cleanHandle(form.handle);
		const invalid = form.name.trim().length < MIN_NAME ? EDIT_COPY.nameMissing : null;
		const badHandle = handle && !HANDLE_RE.test(handle) ? EDIT_COPY.handleInvalid : null;
		if (invalid ?? badHandle) {
			setError(invalid ?? badHandle);
			return;
		}
		if (IS_PREVIEW) {
			setIsOpen(false);
			showToast(EDIT_COPY.previewSaved);
			return;
		}
		setIsSaving(true);
		const patch = {
			name: form.name.trim(),
			handle: handle || null,
			city: form.city,
			state: form.state,
		};
		void updateProfile(patch)
			.then(() => (pickedUri ? uploadAvatar(pickedUri) : undefined))
			.then(() => {
				setIsOpen(false);
				showToast(EDIT_COPY.saved);
			})
			.catch((e: unknown) => {
				setError(saveErrorMessage(e));
			})
			.finally(() => {
				setIsSaving(false);
			});
	}, [form, pickedUri, showToast]);

	return {
		isOpen,
		isSaving,
		form,
		photo: pickedUri ?? user?.avatarUrl ?? null,
		error,
		cityOptions: [...new Set([form.city, ...CITIES].filter(Boolean))],
		stateOptions: [...new Set([form.state, ...STATES].filter(Boolean))],
		open,
		close: () => {
			setIsOpen(false);
		},
		setField: (field, value) => {
			setError(null);
			setForm((f) => ({ ...f, [field]: value }));
		},
		pickPhoto,
		save,
	};
};

import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useTranslation } from "react-i18next";

import { useModal } from "@/components/ui/Modal";
import { authApi } from "@/lib/api/auth";
import { IUser } from "@/lib/api/types";
import * as userApi from "@/lib/api/user";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

export interface IUseProfileActionsReturn {
	editName: () => void;
	editEmail: () => void;
	editBirthday: () => void;
	editPassword: () => void;
	handleLogout: () => void;
	handleDeleteAccount: () => void;
}

type IEditableField = "name" | "email" | "birthday";

const getInitialValue = (user: IUser | null, field: IEditableField): string => {
	if (!user) return "";
	return user[field] ?? "";
};

export const useProfileActions = (): IUseProfileActionsReturn => {
	const router = useRouter();
	const { t } = useTranslation("profile");
	const modal = useModal();
	const user = useStore((state) => state.user);
	const setUser = useStore((state) => state.setUser);
	const logout = useStore((state) => state.logout);

	const makeEditField = useCallback(
		(field: IEditableField) => () => {
			void (async () => {
				const value = await modal.input({
					title: t(`alerts.edit.title.${field}`),
					placeholder: t(`alerts.edit.placeholder.${field}`),
					initialValue: getInitialValue(user, field),
				});
				if (value === null) return;
				try {
					const updated = await userApi.updateMe({ [field]: value });
					setUser(updated);
				} catch {
					await modal.alert({ title: t("alerts.edit.error") });
				}
			})();
		},
		[modal, t, user, setUser],
	);

	const editName = makeEditField("name");
	const editEmail = makeEditField("email");
	const editBirthday = makeEditField("birthday");

	const editPassword = useCallback(() => {
		void (async () => {
			const currentPassword = await modal.input({
				title: t("alerts.password.currentTitle"),
				placeholder: "••••••••",
			});
			if (currentPassword === null) return;

			const newPassword = await modal.input({
				title: t("alerts.password.newTitle"),
				placeholder: "••••••••",
			});
			if (newPassword === null) return;

			try {
				await userApi.updatePassword({ currentPassword, newPassword });
				await modal.alert({ title: t("alerts.password.success") });
			} catch {
				await modal.alert({ title: t("alerts.password.error") });
			}
		})();
	}, [modal, t]);

	const handleLogout = useCallback(() => {
		void (async () => {
			const ok = await modal.confirm({
				title: t("alerts.logout.title"),
				message: t("alerts.logout.message"),
				confirmLabel: t("alerts.logout.confirm"),
				cancelLabel: t("alerts.logout.cancel"),
				variant: "danger",
			});
			if (!ok) return;
			try {
				await authApi.logout();
			} catch {
				// ignora silenciosamente
			}
			logout();
			router.replace(ROUTES.WELCOME);
		})();
	}, [modal, t, logout, router]);

	const handleDeleteAccount = useCallback(() => {
		void (async () => {
			const first = await modal.confirm({
				title: t("alerts.deleteAccount.title"),
				message: t("alerts.deleteAccount.message"),
				confirmLabel: t("alerts.deleteAccount.continue"),
				cancelLabel: t("alerts.deleteAccount.cancel"),
				variant: "danger",
			});
			if (!first) return;

			const second = await modal.confirm({
				title: t("alerts.deleteAccount.confirmTitle"),
				message: t("alerts.deleteAccount.confirmMessage"),
				confirmLabel: t("alerts.deleteAccount.delete"),
				cancelLabel: t("alerts.deleteAccount.cancel"),
				variant: "danger",
			});
			if (!second) return;

			try {
				await userApi.deleteMe();
			} catch {
				// ignora silenciosamente
			}
			logout();
			router.replace(ROUTES.WELCOME);
		})();
	}, [modal, t, logout, router]);

	return {
		editName,
		editEmail,
		editBirthday,
		editPassword,
		handleLogout,
		handleDeleteAccount,
	};
};

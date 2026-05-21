import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { useModal } from "@/components/ui/Modal";
import { normalizeReferralCode } from "@/lib/referral";
import { applyReferralCode } from "@/lib/supabase";
import { useStore } from "@/store";

export const useReferralPrompt = (): void => {
	const { t } = useTranslation("home");
	const modal = useModal();
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasHydrated = useStore((state) => state._hasHydrated);
	const hasSeen = useStore((state) => state.hasSeenReferralPrompt);
	const setHasSeen = useStore((state) => state.setHasSeenReferralPrompt);
	const triggered = useRef(false);

	useEffect(() => {
		if (!hasHydrated || !isAuthenticated || hasSeen || triggered.current) {
			return;
		}
		triggered.current = true;

		void (async () => {
			const ok = await modal.confirm({
				title: t("referralPrompt.title"),
				message: t("referralPrompt.message"),
				confirmLabel: t("referralPrompt.confirmLabel"),
				cancelLabel: t("referralPrompt.skipLabel"),
			});

			if (ok) {
				const code = await modal.input({
					title: t("referralPrompt.inputTitle"),
					placeholder: t("referralPrompt.inputPlaceholder"),
					validation: (value) => (normalizeReferralCode(value).length < 4 ? "invalid" : null),
				});

				if (code) {
					try {
						await applyReferralCode({ code: normalizeReferralCode(code) });
						await modal.alert({ title: t("referralPrompt.applied") });
					} catch {
						await modal.alert({ title: t("referralPrompt.errorInvalid") });
					}
				}
			}

			setHasSeen(true);
		})();
	}, [hasHydrated, isAuthenticated, hasSeen, modal, t, setHasSeen]);
};

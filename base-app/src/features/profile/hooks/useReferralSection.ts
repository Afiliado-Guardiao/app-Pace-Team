import { useCallback, useState } from "react";

import * as Clipboard from "expo-clipboard";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useModal } from "@/components/ui/Modal";
import { applyReferralCode, getReferralStats, IReferralStats } from "@/lib/supabase";

const REFERRAL_STATS_KEY = ["referral-stats"] as const;

export interface IUseReferralSectionReturn {
	stats: IReferralStats | undefined;
	isLoading: boolean;
	isApplying: boolean;
	applyCode: (code: string) => void;
	copyMyCode: () => void;
}

export const useReferralSection = (): IUseReferralSectionReturn => {
	const { t } = useTranslation("profile");
	const modal = useModal();
	const queryClient = useQueryClient();
	const [isApplying, setIsApplying] = useState(false);

	// stats.myCode é read-only: gerado no signup pelo servidor, nunca editável no app.
	const { data: stats, isLoading } = useQuery<IReferralStats>({
		queryKey: REFERRAL_STATS_KEY,
		queryFn: getReferralStats,
	});

	const applyCode = useCallback(
		(code: string) => {
			void (async () => {
				setIsApplying(true);
				try {
					await applyReferralCode({ code });
					await queryClient.invalidateQueries({ queryKey: REFERRAL_STATS_KEY });
					await modal.alert({ title: t("referral.applySuccess") });
				} catch {
					await modal.alert({ title: t("referral.applyErrorInvalid") });
				} finally {
					setIsApplying(false);
				}
			})();
		},
		[modal, t, queryClient],
	);

	const copyMyCode = useCallback(() => {
		void (async () => {
			if (!stats?.myCode) return;
			await Clipboard.setStringAsync(stats.myCode);
			await modal.alert({ title: t("referral.copied") });
		})();
	}, [stats, modal, t]);

	return {
		stats,
		isLoading,
		isApplying,
		applyCode,
		copyMyCode,
	};
};

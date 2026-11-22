import React from "react";

import { Button, Sheet } from "@/components/pace";
import { formatMl } from "@/lib/hydration";

import { NoticeBody } from "./NoticeBody";
import { useHydroNoticeSheet } from "./useHydroNoticeSheet";

const COPY = {
	title: "Água depois da corrida",
	log: (ml: string) => `Bebi ${ml} agora`,
	open: "Abrir o PACE HYDRATION",
	close: "Fechar",
} as const;

// Pop-up aberto pela notificação de água: a conta completa daquela corrida
export const HydroNotice: React.FC = () => {
	const sheet = useHydroNoticeSheet();
	if (!sheet.notice) return null;

	return (
		<Sheet
			title={COPY.title}
			onClose={sheet.close}
			testID="hydro-notice"
			actions={
				<>
					<Button fullWidth icon="plus" onPress={sheet.log} testID="hydro-notice-log">
						{COPY.log(formatMl(sheet.logMl))}
					</Button>
					<Button fullWidth variant="glass" onPress={sheet.openScreen} testID="hydro-notice-open">
						{COPY.open}
					</Button>
					<Button fullWidth variant="ghost" onPress={sheet.close} testID="hydro-notice-close">
						{COPY.close}
					</Button>
				</>
			}
		>
			<NoticeBody notice={sheet.notice} />
		</Sheet>
	);
};

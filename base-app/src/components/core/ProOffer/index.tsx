import React from "react";
import { Text, useWindowDimensions } from "react-native";

import { Button, FloatingToast, Sheet } from "@/components/pace";
import { useTheme } from "@/theme";
import { PRO_OFFER_COPY as C, useAutoLinkPro, useProOffer } from "@/lib/pro";

import { OfferBody } from "./OfferBody";
import { createProOfferStyles } from "./styles";

// Janela do Team Pro, a mesma no app inteiro: abre quando alguém sem o Pro
// tenta usar um recurso Pro (ou sai dele). Também liga a assinatura feita sem
// equipe à equipe que a pessoa criar depois.
export const ProOffer: React.FC = () => {
	const { theme } = useTheme();
	const { height } = useWindowDimensions();
	const offer = useProOffer();
	useAutoLinkPro();
	const styles = createProOfferStyles(theme, height);
	if (!offer.source) return null;

	if (offer.isDone) {
		return (
			<Sheet
				title={C.doneTitle}
				onClose={offer.close}
				testID="pro-offer-done"
				actions={
					<Button fullWidth icon="crown" onPress={offer.finish} testID="pro-offer-finish">
						{offer.needsTeam ? C.doneCreateTeam : C.doneOk}
					</Button>
				}
			>
				<Text style={styles.sub}>{offer.needsTeam ? C.doneSolo : C.doneTeam}</Text>
			</Sheet>
		);
	}

	const isBusy = offer.isBusy || offer.isConfirming;
	const cta = offer.isConfirming
		? C.confirming
		: offer.selected?.trial
			? C.startTrial
			: `${C.subscribe}${offer.selected?.price ?? ""}`;

	return (
		<Sheet
			onClose={offer.close}
			testID="pro-offer"
			actions={
				<>
					{offer.isError ? (
						<Button fullWidth variant="glass" onPress={offer.retry} testID="pro-offer-retry">
							{C.retry}
						</Button>
					) : (
						<Button
							size="lg"
							fullWidth
							icon="crown"
							disabled={!offer.selected || isBusy}
							onPress={offer.subscribe}
							testID="pro-offer-subscribe"
						>
							{cta}
						</Button>
					)}
					<Button fullWidth variant="ghost" onPress={offer.close} testID="pro-offer-later">
						{C.later}
					</Button>
				</>
			}
		>
			<OfferBody offer={offer} styles={styles} />
			<FloatingToast toast={offer.toast} />
		</Sheet>
	);
};

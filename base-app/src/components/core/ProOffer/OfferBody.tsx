import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { IUseProOfferReturn, PRO_OFFER_COPY as C, PRO_OFFER_LEADS } from "@/lib/pro";

import { OfferPlans } from "./OfferPlans";
import { IProOfferStyles } from "./styles";

interface IOfferBodyProps {
	offer: IUseProOfferReturn;
	styles: IProOfferStyles;
}

// O que o Team Pro libera, para quantas pessoas, os planos e o rodapé da Apple
export const OfferBody: React.FC<IOfferBodyProps> = ({ offer, styles }) => {
	const lead = PRO_OFFER_LEADS[offer.source ?? "general"];
	const legal = offer.selected?.trial ? `${C.legal}${C.trialLegal}` : C.legal;

	return (
		<ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
			<View style={styles.body}>
				<View style={styles.badge}>
					<Icon name="crown" size={14} color={styles.gold} />
					<Text style={styles.badgeText}>{C.badge}</Text>
				</View>
				<Text style={styles.lead}>{lead}</Text>
				<View>
					<Text style={styles.title}>{C.title}</Text>
					<Text style={styles.sub}>{C.sub}</Text>
				</View>
				{C.benefits.map((b) => (
					<View key={b.icon} style={styles.row}>
						<Icon name={b.icon} size={18} color={styles.icon} />
						<Text style={styles.benefit}>{b.text}</Text>
					</View>
				))}
				<Text style={styles.fair}>{C.fair}</Text>
				<OfferPlans offer={offer} styles={styles} />
				<Text style={styles.legal}>{legal}</Text>
				<View style={styles.links}>
					<Text
						style={styles.link}
						onPress={offer.restore}
						accessibilityRole="button"
						accessibilityLabel={C.restore}
						testID="pro-offer-restore"
					>
						{C.restore}
					</Text>
					<Text
						style={styles.link}
						onPress={offer.openTerms}
						accessibilityRole="link"
						accessibilityLabel={C.terms}
						testID="pro-offer-terms"
					>
						{C.terms}
					</Text>
					<Text
						style={styles.link}
						onPress={offer.openPrivacy}
						accessibilityRole="link"
						accessibilityLabel={C.privacy}
						testID="pro-offer-privacy"
					>
						{C.privacy}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
};

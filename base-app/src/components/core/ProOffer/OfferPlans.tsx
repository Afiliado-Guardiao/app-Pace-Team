import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { IUseProOfferReturn, PRO_OFFER_COPY as C } from "@/lib/pro";
import { IPlan } from "@/lib/purchases";

import { IProOfferStyles } from "./styles";

interface IOfferPlansProps {
	offer: IUseProOfferReturn;
	styles: IProOfferStyles;
}

const subOf = (plan: IPlan): string | null => {
	const parts = [
		plan.period === "annual" ? `${plan.perMonth}${C.annualEquivalent}` : null,
		plan.trial ? `${plan.trial}${C.trialSuffix}` : null,
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" · ") : null;
};

// Mensal e anual com o preço da Apple (escolhe um e assina no botão de baixo)
export const OfferPlans: React.FC<IOfferPlansProps> = ({ offer, styles }) => {
	if (offer.isLoading) return <ActivityIndicator color={styles.icon} />;
	if (offer.isError) return <Text style={styles.sub}>{C.loadError}</Text>;

	return (
		<View style={styles.body}>
			{offer.plans.map((plan) => {
				const isSelected = plan.id === offer.selected?.id;
				const isAnnual = plan.period === "annual";
				const sub = subOf(plan);
				return (
					<Pressable
						key={plan.id}
						onPress={() => {
							offer.select(plan.id);
						}}
						accessibilityRole="radio"
						accessibilityState={{ selected: isSelected }}
						accessibilityLabel={`${isAnnual ? C.annual : C.monthly} ${plan.price}`}
						testID={`pro-offer-plan-${plan.period}`}
						style={styles.plan(isSelected)}
					>
						<View style={styles.radio(isSelected)} />
						<View style={styles.planBody}>
							<View style={styles.row}>
								<Text style={styles.planTitle}>{isAnnual ? C.annual : C.monthly}</Text>
								{isAnnual && offer.savings ? (
									<Text style={styles.saveBadge}>{`${C.save}${offer.savings}`}</Text>
								) : null}
							</View>
							{sub ? <Text style={styles.planSub}>{sub}</Text> : null}
						</View>
						<Text style={styles.price}>
							{plan.price}
							<Text style={styles.unit}>{isAnnual ? C.perYear : C.perMonth}</Text>
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
};

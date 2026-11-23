import React from "react";
import { Text, View } from "react-native";

import { Button, Icon, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { AI_CONSENT_COPY as C } from "../../constants";

interface IAiConsentSheetProps {
	isOpen: boolean;
	onAccept: () => void;
	onDecline: () => void;
	onPrivacy: () => void;
}

const createAiConsentSheetStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const text = {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.sm,
		lineHeight: typography.sizes.sm * 1.45,
		color: colors.textSecondary,
	};
	return {
		body: { gap: spacing[3] },
		text,
		row: { flexDirection: "row" as const, gap: spacing[2] },
		item: { ...text, flex: 1, color: colors.textPrimary },
		link: { ...text, color: colors.textAccent, textDecorationLine: "underline" as const },
		icon: colors.textAccent,
	};
};

// Pedido de permissão antes do primeiro uso da PACE AI: o que vai, para quem
// e para quê. Sem o "Concordo", nada é enviado.
export const AiConsentSheet: React.FC<IAiConsentSheetProps> = ({
	isOpen,
	onAccept,
	onDecline,
	onPrivacy,
}) => {
	const { theme } = useTheme();
	const styles = createAiConsentSheetStyles(theme);

	return (
		<Sheet
			open={isOpen}
			title={C.title}
			onClose={onDecline}
			testID="pace-ai-consent"
			actions={
				<>
					<Button fullWidth icon="check" onPress={onAccept} testID="pace-ai-consent-accept">
						{C.accept}
					</Button>
					<Button fullWidth variant="ghost" onPress={onDecline} testID="pace-ai-consent-decline">
						{C.decline}
					</Button>
				</>
			}
		>
			<View style={styles.body}>
				<Text style={styles.text}>{C.lead}</Text>
				{C.items.map((item) => (
					<View key={item} style={styles.row}>
						<Icon name="dot" size={18} color={styles.icon} />
						<Text style={styles.item}>{item}</Text>
					</View>
				))}
				<Text style={styles.text}>{C.use}</Text>
				<Text
					style={styles.link}
					onPress={onPrivacy}
					accessibilityRole="link"
					accessibilityLabel={C.privacy}
					testID="pace-ai-consent-privacy"
				>
					{C.privacy}
				</Text>
			</View>
		</Sheet>
	);
};

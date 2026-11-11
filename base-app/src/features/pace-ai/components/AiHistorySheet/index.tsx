import React from "react";
import { Pressable, Text, View } from "react-native";

import { Button, Icon, IconButton, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IAiConversation } from "@/lib/supabase";

import { PACE_AI_COPY as C } from "../../constants";

export interface IAiHistoryModel {
	isOpen: boolean;
	items: IAiConversation[];
	activeId: string | null;
	close: () => void;
	pick: (id: string) => void;
	remove: (id: string) => void;
	startNew: () => void;
}

interface IAiHistorySheetProps {
	model: IAiHistoryModel;
}

const createAiHistorySheetStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		list: { gap: spacing[2] },
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			paddingLeft: spacing[3],
			paddingVertical: spacing[1],
			borderRadius: 14,
			backgroundColor: colors.glass1,
		},
		active: { borderWidth: 1, borderColor: colors.accentRing },
		title: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		empty: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		icon: colors.textTertiary,
	};
};

// Histórico: abrir uma conversa antiga, apagar ou começar outra
export const AiHistorySheet: React.FC<IAiHistorySheetProps> = ({ model }) => {
	const { theme } = useTheme();
	const styles = createAiHistorySheetStyles(theme);

	return (
		<Sheet
			open={model.isOpen}
			title={C.history}
			onClose={model.close}
			actions={
				<Button fullWidth icon="plus" onPress={model.startNew} testID="pace-ai-new">
					{C.newChat}
				</Button>
			}
		>
			<View style={styles.list}>
				{model.items.length === 0 ? <Text style={styles.empty}>{C.emptyHistory}</Text> : null}
				{model.items.map((item) => (
					<View
						key={item.id}
						style={[styles.row, item.id === model.activeId ? styles.active : null]}
					>
						<Icon name="message-circle" size={16} color={styles.icon} />
						<Pressable
							style={styles.title}
							onPress={() => {
								model.pick(item.id);
							}}
							accessibilityRole="button"
							accessibilityLabel={item.title}
							testID={`pace-ai-history-${item.id}`}
						>
							<Text style={styles.title} numberOfLines={2}>
								{item.title}
							</Text>
						</Pressable>
						<IconButton
							icon="trash-2"
							label={C.remove}
							size={36}
							onPress={() => {
								model.remove(item.id);
							}}
							testID={`pace-ai-remove-${item.id}`}
						/>
					</View>
				))}
			</View>
		</Sheet>
	);
};

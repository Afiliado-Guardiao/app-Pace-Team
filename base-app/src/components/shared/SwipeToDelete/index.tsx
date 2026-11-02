import React from "react";
import { Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { useSwipeToDelete } from "./hooks/useSwipeToDelete";
import { createSwipeToDeleteStyles } from "./styles";

interface ISwipeToDeleteProps {
	children: React.ReactNode;
	// Exclui de verdade; false = a pessoa desistiu (a linha volta)
	onDelete: () => Promise<boolean>;
	// Corrida de outra pessoa (ex.: Histórico › Equipe): não arrasta
	isEnabled?: boolean;
	testID?: string;
}

// Linha que, arrastada para a esquerda, mostra a lixeira vermelha e exclui.
export const SwipeToDelete: React.FC<ISwipeToDeleteProps> = ({
	children,
	onDelete,
	isEnabled = true,
	testID = "swipe-to-delete",
}) => {
	const { theme } = useTheme();
	const swipe = useSwipeToDelete({ onDelete, isEnabled });
	const styles = createSwipeToDeleteStyles(theme);

	return (
		<View style={styles.root} onLayout={swipe.onLayout}>
			<View style={styles.trashArea}>
				<Pressable
					onPress={swipe.remove}
					style={styles.trash}
					accessibilityRole="button"
					accessibilityLabel="Excluir corrida"
					testID={`${testID}-trash`}
				>
					<Icon name="trash" size={24} color={theme.pace.colors.ink.white} />
				</Pressable>
			</View>
			<Animated.View style={swipe.rowStyle} {...swipe.panHandlers}>
				{children}
				{swipe.isOpen ? (
					<Pressable
						onPress={swipe.close}
						style={styles.cover}
						accessibilityRole="button"
						accessibilityLabel="Fechar"
						testID={`${testID}-close`}
					/>
				) : null}
			</Animated.View>
		</View>
	);
};

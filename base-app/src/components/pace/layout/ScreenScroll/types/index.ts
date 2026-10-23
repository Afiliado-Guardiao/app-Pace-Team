import { ScrollView, StyleProp, ViewStyle } from "react-native";

export interface IScreenScrollProps {
	children: React.ReactNode;
	// Para rolar até um bloco (ex.: o feed depois de publicar um post)
	scrollRef?: React.RefObject<ScrollView | null>;
	// Telas de aba: reserva a lateral direita para o trilho e mais espaço embaixo
	hasRail?: boolean;
	bottom?: number;
	contentStyle?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IScreenScrollStyles {
	scroll: ViewStyle;
	content: ViewStyle;
}

import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export interface ISheetProps {
	open?: boolean;
	title?: string;
	onClose?: () => void;
	children?: React.ReactNode;
	// Botões empilhados no rodapé da folha
	actions?: React.ReactNode;
	// true = cobre só o contêiner pai (absoluto); false = tela inteira (Modal)
	contained?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ISheetStyles {
	root: ViewStyle;
	scrim: ViewStyle;
	scrimTint: ViewStyle;
	panel: ViewStyle;
	handle: ViewStyle;
	title: TextStyle;
	body: TextStyle;
	actions: ViewStyle;
	appearance: IGlassAppearance;
}

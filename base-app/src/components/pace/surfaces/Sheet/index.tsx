import React from "react";
import { Modal } from "react-native";

import { SheetPanel } from "./SheetPanel";
import { ISheetProps } from "./types";

// Folha inferior (bottom sheet). contained = dentro do contêiner pai;
// senão abre sobre a tela inteira num Modal transparente.
export const Sheet: React.FC<ISheetProps> = ({ open = true, contained = false, ...panel }) => {
	if (!open) return null;

	if (contained) return <SheetPanel {...panel} />;

	return (
		<Modal
			transparent
			visible
			animationType="none"
			statusBarTranslucent
			onRequestClose={panel.onClose}
		>
			<SheetPanel {...panel} />
		</Modal>
	);
};

export * from "./types";

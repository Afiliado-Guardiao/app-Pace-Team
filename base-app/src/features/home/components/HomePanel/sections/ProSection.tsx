import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

import { useTheme } from "@/theme";

import { IProSectionId } from "../constants";
import { PANEL_COPY, PRO_COPY } from "../copy";
import { IPanelData } from "../hooks/usePanelData";

import { PanelButton } from "./PanelButton";
import { ProPreview } from "./ProPreview";
import { createSectionStyles } from "./styles";

interface IProSectionProps {
	id: IProSectionId;
	data: IPanelData["pro"];
	// Sem o Pro: dá para ver tudo; usar pede a assinatura
	isLocked: boolean;
	k: number;
	onOpen: () => void;
}

// Recurso do Pro no painel: a prévia do que tem dentro, o selo PRO e o botão
export const ProSection: React.FC<IProSectionProps> = ({ id, data, isLocked, k, onOpen }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const copy = PRO_COPY[id];
	const pro: ViewStyle = {
		paddingHorizontal: 9,
		paddingVertical: 3,
		borderRadius: 999,
		backgroundColor: "#fff",
	};
	const proText: TextStyle = {
		fontFamily: theme.pace.typography.fonts.extrabold,
		fontSize: 10,
		letterSpacing: 1,
		color: theme.pace.colors.accent,
	};

	return (
		<View style={[s.root, { gap: 10 * k }]}>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ProPreview id={id} data={data} k={k} />
			</View>
			<View style={[s.row, { justifyContent: "center" }]}>
				<Text style={s.title}>{copy.title}</Text>
				<View style={pro}>
					<Text style={proText}>{PANEL_COPY.pro}</Text>
				</View>
			</View>
			<PanelButton
				label={isLocked ? PANEL_COPY.unlock : PANEL_COPY.open}
				onPress={onOpen}
				isPrimary
				testID={`home-panel-open-${id}`}
			/>
		</View>
	);
};

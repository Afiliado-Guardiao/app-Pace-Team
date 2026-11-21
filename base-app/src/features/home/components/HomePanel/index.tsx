import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { IBuddyColorId } from "@/lib/buddy";

import { BUDDY_INDEX, PANEL, PANEL_SECTIONS } from "./constants";
import { IHomePanel } from "./hooks/useHomePanel";
import { PanelAcrylic } from "./PanelAcrylic";
import { PanelBubbles } from "./PanelBubbles";
import { PanelSection } from "./sections/PanelSection";
import { createHomePanelStyles, sectionHeightOf } from "./styles";

interface IHomePanelProps {
	panel: IHomePanel;
	budColor: IBuddyColorId;
	// A cena atual do Buddy (medidor, pista, corredores), sem mudanças
	buddy: React.ReactNode;
	// Muda ao abrir o app, ao voltar ao Início e ao voltar do segundo plano:
	// as animações da seção na frente (medidor dos Pontos) recomeçam
	replay: number;
}

// Só a seção atual e as vizinhas ficam montadas; a do Buddy, sempre (o
// relógio do clima e dos corredores não pode reiniciar)
const isMounted = (i: number, index: number): boolean =>
	i === BUDDY_INDEX || Math.abs(i - index) <= 1;

// Card de acrílico do Início: bolinhas de vidro (atalhos) e as seções que
// passam para o lado
export const HomePanel: React.FC<IHomePanelProps> = ({ panel, budColor, buddy, replay }) => {
	const { pager } = panel;
	const width = pager.width;
	const height = PANEL.bubblesHeight + sectionHeightOf(width);
	const styles = createHomePanelStyles({ width, height });
	const k = width / PANEL.baseWidth;

	return (
		<View
			style={styles.card}
			onLayout={(e) => {
				pager.setWidth(e.nativeEvent.layout.width);
			}}
			{...pager.handlers}
			testID="home-panel"
		>
			<View style={styles.clip}>
				<PanelAcrylic width={width} height={height} />
				{width > 0 ? (
					<View style={styles.sections}>
						<Animated.View style={[styles.track, pager.trackStyle]}>
							{PANEL_SECTIONS.map((s, i) =>
								isMounted(i, pager.index) ? (
									<View key={s.id} style={styles.slot(i)}>
										{s.id === "ranking" ? (
											<PanelSection section={s} panel={panel} k={k} replay={replay} />
										) : (
											<View style={styles.inner}>
												{s.id === "buddy" ? (
													buddy
												) : (
													<PanelSection section={s} panel={panel} k={k} replay={replay} />
												)}
											</View>
										)}
									</View>
								) : null,
							)}
						</Animated.View>
					</View>
				) : null}
				<PanelBubbles sections={PANEL_SECTIONS} pager={pager} budColor={budColor} />
			</View>
			<View style={styles.rim} pointerEvents="none" />
		</View>
	);
};

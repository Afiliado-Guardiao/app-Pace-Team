import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard, Sheet, StatTile, Toast, Tooltip } from "@/components/pace";
import { useTheme } from "@/theme";

import { CARD_VARIANTS, PHOTO_CARD, TOAST_TONES } from "../../constants";
import { createCatalogSectionStyles } from "../../styles";
import { ICatalogState } from "../../types";
import { CatalogSection } from "../CatalogSection";

interface ISurfacesShowcaseProps {
	catalog: ICatalogState;
}

// Cards de vidro, card com foto, avisos, balões e folha inferior.
export const SurfacesShowcase: React.FC<ISurfacesShowcaseProps> = ({ catalog }) => {
	const { theme } = useTheme();
	const styles = createCatalogSectionStyles(theme);

	return (
		<>
			<CatalogSection title="Cards de vidro" caption="default · strong · dark · accent (seu time)">
				<GlassCard onPress={catalog.replay}>
					<View style={styles.row}>
						<StatTile icon="route" label="Distância" value="10,58" unit="km" style={styles.grow} />
						<StatTile icon="timer" label="Tempo" value="54:12" style={styles.grow} />
					</View>
				</GlassCard>
				{CARD_VARIANTS.slice(1).map((variant) => (
					<GlassCard key={variant} variant={variant}>
						<Text style={styles.cardTitle}>{variant}</Text>
						<Text style={styles.cardText}>Uma corrida de 6 km hoje já garante +52 pts.</Text>
					</GlassCard>
				))}
				<GlassCard image={PHOTO_CARD} padding={22}>
					<Text style={styles.cardTitle}>Card com foto</Text>
					<Text style={styles.cardText}>Foto + scrim azul-marinho no lugar do vidro.</Text>
				</GlassCard>
			</CatalogSection>

			<CatalogSection title="Avisos">
				{TOAST_TONES.map((tone) => (
					<Toast
						key={tone}
						tone={tone}
						title={`Toast ${tone}`}
						message="Faltam 65 pts para passar os Trail Kings."
						action={tone === "accent" ? { label: "Ver", onPress: catalog.replay } : undefined}
					/>
				))}
			</CatalogSection>

			<CatalogSection title="Balões">
				<View style={styles.rowCenter}>
					<Tooltip>+52 pts</Tooltip>
					<Tooltip placement="bottom">Hoje</Tooltip>
					<Tooltip accent>Você</Tooltip>
				</View>
			</CatalogSection>

			<CatalogSection title="Folha inferior" caption="abre sobre a tela inteira">
				<Button variant="glass" icon="square" onPress={catalog.openSheet}>
					Finalizar corrida
				</Button>
				<Sheet
					open={catalog.isSheetOpen}
					title="Finalizar corrida?"
					onClose={catalog.closeSheet}
					actions={
						<>
							<Button fullWidth size="lg" onPress={catalog.closeSheet}>
								Finalizar e salvar
							</Button>
							<Button fullWidth variant="ghost" onPress={catalog.closeSheet}>
								Continuar correndo
							</Button>
						</>
					}
				>
					5,24 km em 26:50. Os pontos contam após a verificação.
				</Sheet>
			</CatalogSection>
		</>
	);
};

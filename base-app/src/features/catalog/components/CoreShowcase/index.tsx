import React from "react";
import { Text, View } from "react-native";

import {
	Avatar,
	AvatarStack,
	Badge,
	Button,
	Chip,
	CountUp,
	Icon,
	IconButton,
	Logo,
} from "@/components/pace";
import { useTheme } from "@/theme";

import {
	BADGE_TONES,
	BUTTON_VARIANTS,
	CHIP_OPTIONS,
	CREW_PHOTOS,
	ICON_BUTTON_VARIANTS,
	ICON_SAMPLES,
	LOGO_VARIANTS,
	MEMBERS,
} from "../../constants";
import { createCatalogSectionStyles } from "../../styles";
import { ICatalogState } from "../../types";
import { CatalogSection } from "../CatalogSection";

interface ICoreShowcaseProps {
	catalog: ICatalogState;
}

// Botões, chips, etiquetas, avatares, logos, ícones e números animados.
export const CoreShowcase: React.FC<ICoreShowcaseProps> = ({ catalog }) => {
	const { theme } = useTheme();
	const styles = createCatalogSectionStyles(theme);

	return (
		<>
			<CatalogSection title="Botões" caption="primary · glass · outline · ghost · light">
				<Button size="lg" fullWidth icon="play" onPress={catalog.replay}>
					Começar corrida
				</Button>
				<View style={styles.row}>
					{BUTTON_VARIANTS.map((variant) => (
						<Button key={variant} variant={variant} size="sm" testID={`catalog-btn-${variant}`}>
							{variant}
						</Button>
					))}
				</View>
				<View style={styles.row}>
					<Button variant="glass" iconRight="arrow-right">
						Próximo
					</Button>
					<Button disabled>Desativado</Button>
				</View>
			</CatalogSection>

			<CatalogSection title="Botões de ícone" caption="glass · accent · dark · light · com aviso">
				<View style={styles.rowCenter}>
					{ICON_BUTTON_VARIANTS.map((variant) => (
						<IconButton key={variant} icon="bell" label={variant} variant={variant} />
					))}
					<IconButton icon="bell" label="Notificações" badge />
					<IconButton icon="play" label="Iniciar" variant="accent" size={62} />
				</View>
			</CatalogSection>

			<CatalogSection title="Chips e etiquetas">
				<View style={styles.row}>
					{CHIP_OPTIONS.map((option) => (
						<Chip
							key={option}
							selected={catalog.chip === option}
							onPress={() => {
								catalog.setChip(option);
							}}
						>
							{option}
						</Chip>
					))}
					<Chip size="sm" icon="flame">
						Pequeno
					</Chip>
				</View>
				<View style={styles.row}>
					{BADGE_TONES.map((tone) => (
						<Badge key={tone} tone={tone} dot={tone === "success"}>
							{tone}
						</Badge>
					))}
				</View>
			</CatalogSection>

			<CatalogSection title="Avatares">
				<View style={styles.rowCenter}>
					<Avatar src={CREW_PHOTOS.crew1} name="Ana Souza" size={48} />
					<Avatar src={CREW_PHOTOS.crew2} name="Rafael Lima" size={48} ring />
					<Avatar name="Lucas Moreira" size={48} />
					<Avatar name="Pace Sharks" size={48} square />
					<AvatarStack people={MEMBERS} size={32} />
				</View>
			</CatalogSection>

			<CatalogSection title="Logo" caption="sempre sobre fundo escuro">
				<View style={styles.rowCenter}>
					{LOGO_VARIANTS.map((variant) => (
						<Logo key={variant} variant={variant} height={36} />
					))}
				</View>
			</CatalogSection>

			<CatalogSection title="Ícones" caption="Lucide · traço 1,75">
				<View style={styles.rowCenter}>
					{ICON_SAMPLES.map((name) => (
						<Icon key={name} name={name} size={22} />
					))}
				</View>
			</CatalogSection>

			<CatalogSection title="Números animados" caption="toque em Começar corrida para rever">
				<View style={styles.rowCenter} key={catalog.replayKey}>
					<Text style={styles.metric}>
						<CountUp value="2.140" /> pts
					</Text>
					<Text style={styles.metric}>
						<CountUp value="10,58" /> km
					</Text>
					<Text style={styles.metric}>
						<CountUp value={"5'07\""} />
					</Text>
				</View>
			</CatalogSection>
		</>
	);
};

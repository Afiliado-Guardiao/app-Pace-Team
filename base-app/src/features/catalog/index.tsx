import React from "react";
import { ScrollView, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge, IconButton, Logo, ScreenBackground, TabBar } from "@/components/pace";
import { useTheme } from "@/theme";

import {
	CoreShowcase,
	DataShowcase,
	FormsShowcase,
	NavigationShowcase,
	SurfacesShowcase,
} from "./components";
import { useCatalogScreen } from "./hooks/useCatalogScreen";
import { createCatalogStyles } from "./styles";

const RAIL_SIZE = 42;

// Catálogo do design system PACE TEAM (só em desenvolvimento): todos os
// componentes sobre o fundo real das telas, para conferir o visual no iPhone.
export const CatalogScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const catalog = useCatalogScreen();
	const styles = createCatalogStyles(theme, insets);

	return (
		<View style={styles.scroll}>
			<ScreenBackground />
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
				testID="catalog-scroll"
			>
				<View style={styles.header}>
					<IconButton icon="arrow-left" label="Voltar" onPress={catalog.goBack} />
					<Logo height={34} />
					<Text style={styles.headerTitle}>Catálogo PACE</Text>
					<Badge tone="accent">Só em desenvolvimento</Badge>
					<Text style={styles.headerHint}>
						Todos os componentes do design system com dados de exemplo. Os cards de vidro só
						aparecem com o desfoque real num build de desenvolvimento.
					</Text>
				</View>
				<CoreShowcase catalog={catalog} />
				<FormsShowcase catalog={catalog} />
				<SurfacesShowcase catalog={catalog} />
				<DataShowcase catalog={catalog} />
				<NavigationShowcase catalog={catalog} />
			</ScrollView>
			<View style={styles.rail} pointerEvents="box-none">
				<TabBar
					orientation="vertical"
					size={RAIL_SIZE}
					active={catalog.tab}
					onChange={catalog.setTab}
				/>
			</View>
		</View>
	);
};

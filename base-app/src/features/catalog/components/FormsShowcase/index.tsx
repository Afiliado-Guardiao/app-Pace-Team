import React from "react";
import { View } from "react-native";

import { Checkbox, Input, Radio, SegmentedControl, Select, Switch } from "@/components/pace";
import { useTheme } from "@/theme";

import { CITIES, RANK_SCOPES, STATES, TEAM_SIZES } from "../../constants";
import { createCatalogSectionStyles } from "../../styles";
import { ICatalogState } from "../../types";
import { CatalogSection } from "../CatalogSection";

interface IFormsShowcaseProps {
	catalog: ICatalogState;
}

// Campos, seleção, caixas, opções, interruptor e abas em pílula.
export const FormsShowcase: React.FC<IFormsShowcaseProps> = ({ catalog }) => {
	const { theme } = useTheme();
	const styles = createCatalogSectionStyles(theme);

	return (
		<>
			<CatalogSection title="Campos" caption="toque para ver o foco laranja">
				<Input
					label="E-mail"
					icon="mail"
					type="email"
					placeholder="voce@email.com"
					value={catalog.email}
					onChangeText={catalog.setEmail}
				/>
				<Input label="Senha" icon="lock" type="password" hint="Mínimo de 8 caracteres" />
				<Input label="Nome do time" icon="users" defaultValue="Pace" error="Esse nome já existe" />
				<View style={styles.row}>
					<Select label="Cidade" options={CITIES} defaultValue="Campinas" style={styles.growWide} />
					<Select label="Estado" options={STATES} defaultValue="SP" style={styles.grow} />
				</View>
			</CatalogSection>

			<CatalogSection title="Abas em pílula">
				<SegmentedControl options={RANK_SCOPES} value={catalog.scope} onChange={catalog.setScope} />
				<SegmentedControl
					size="sm"
					options={RANK_SCOPES}
					value={catalog.scope}
					onChange={catalog.setScope}
				/>
			</CatalogSection>

			<CatalogSection title="Seleção">
				<View style={styles.column}>
					{TEAM_SIZES.map((size) => (
						<Radio
							key={size.value}
							label={size.label}
							description={size.description}
							checked={catalog.teamSize === size.value}
							onChange={() => {
								catalog.setTeamSize(size.value);
							}}
						/>
					))}
				</View>
				<Checkbox
					checked={catalog.acceptedTerms}
					onChange={catalog.setAcceptedTerms}
					label="Li e aceito os Termos de Uso e a Política de Privacidade."
				/>
				<Switch
					label="Avisos do time"
					checked={catalog.notifications}
					onChange={catalog.setNotifications}
				/>
				<Switch label="Desativado" disabled />
			</CatalogSection>
		</>
	);
};

import React from "react";

import { TabBar, TopBar } from "@/components/pace";

import { ICatalogState } from "../../types";
import { CatalogSection } from "../CatalogSection";

interface INavigationShowcaseProps {
	catalog: ICatalogState;
}

// Barra do topo e barra de abas horizontal. O trilho lateral flutua à direita da tela.
export const NavigationShowcase: React.FC<INavigationShowcaseProps> = ({ catalog }) => (
	<CatalogSection
		title="Navegação"
		caption="o trilho de abas à direita é a navegação do app: toque ou arraste"
	>
		<TopBar
			title="Criar conta"
			onBack={catalog.goBack}
			right={{ icon: "bell", label: "Notificações", badge: true }}
		/>
		<TabBar active={catalog.tab} accentId="run" onChange={catalog.setTab} />
		<TabBar active={catalog.tab} onChange={catalog.setTab} showLabels size={48} />
	</CatalogSection>
);

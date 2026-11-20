import { useEffect, useState } from "react";

import { PANEL_SECTIONS } from "../constants";

import { IPanelAction, usePanelActions } from "./usePanelActions";
import { IPanelData, usePanelData } from "./usePanelData";
import { IPanelPager, usePanelPager } from "./usePanelPager";

export interface IHomePanel {
	pager: IPanelPager;
	data: IPanelData;
	open: (id: IPanelAction) => void;
	title: { icon: string | null; title: string; subtitle: string };
	// Conta as entradas em cada seção (as contagens recomeçam a cada visita)
	visit: number;
}

// Painel de seções do Início: posição, dados, atalhos e o título de cima
export const useHomePanel = (): IHomePanel => {
	const pager = usePanelPager();
	const data = usePanelData();
	const { open } = usePanelActions();
	const [visit, setVisit] = useState(0);
	const section = PANEL_SECTIONS[pager.index] ?? PANEL_SECTIONS[0];

	useEffect(() => {
		setVisit((v) => v + 1);
	}, [pager.index]);

	return {
		pager,
		data,
		open: (id) => {
			pager.guard(() => {
				open(id);
			})();
		},
		title: { icon: section.icon, ...data.titles[section.id] },
		visit,
	};
};

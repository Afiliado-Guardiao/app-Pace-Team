import React from "react";

import { IPanelSection, PANEL_SECTIONS } from "../constants";
import { IHomePanel } from "../hooks/useHomePanel";

import { PointsSection } from "./PointsSection";
import { ProSection } from "./ProSection";
import { RankingSection } from "./RankingSection";
import { RunSection } from "./RunSection";
import { TeamSection } from "./TeamSection";
import { WheelSection } from "./WheelSection";

interface IPanelSectionProps {
	section: IPanelSection;
	panel: IHomePanel;
	k: number;
}

// Conteúdo de cada seção do painel (a do Buddy vem pronta do Início)
export const PanelSection: React.FC<IPanelSectionProps> = ({ section, panel, k }) => {
	const { data, open, visit } = panel;
	const isActive = PANEL_SECTIONS[panel.pager.index]?.id === section.id;
	const id = section.id;

	if (id === "points") {
		return <PointsSection points={data.points} isActive={isActive} k={k} />;
	}
	if (id === "run") {
		return (
			<RunSection
				run={data.run}
				isActive={isActive}
				k={k}
				onStart={() => {
					open("run");
				}}
			/>
		);
	}
	if (id === "wheel") {
		return (
			<WheelSection
				isActive={isActive}
				k={k}
				onStart={() => {
					open("wheel");
				}}
			/>
		);
	}
	if (id === "ranking") {
		return (
			<RankingSection
				ranking={data.ranking}
				isActive={isActive}
				k={k}
				visit={visit}
				onOpen={() => {
					open("ranking");
				}}
			/>
		);
	}
	if (id === "team") {
		return (
			<TeamSection
				team={data.team}
				k={k}
				onOpen={() => {
					open("team");
				}}
				onInvite={() => {
					open("invite");
				}}
			/>
		);
	}
	if (id === "buddy") return null;
	return (
		<ProSection
			id={id}
			data={data.pro}
			isLocked={!data.isPro}
			k={k}
			onOpen={() => {
				open(id);
			}}
		/>
	);
};

import React from "react";

import { IShareTemplateId } from "../../constants";

import { FeatureTemplates } from "./FeatureTemplates";
import { StatsTemplates } from "./StatsTemplates";
import { IStoryRun } from "./types";

export type { IStoryMember, IStoryPoint, IStoryRun, IStoryTeam } from "./types";

interface IStoryTemplateProps {
	id: IShareTemplateId;
	run: IStoryRun;
}

// Conteúdo do story (espaço 1080 × 1920) para o modelo escolhido.
export const StoryTemplate: React.FC<IStoryTemplateProps> = ({ id, run }) =>
	id === "equipe" || id === "centro" || id === "classico" ? (
		<StatsTemplates id={id} run={run} />
	) : (
		<FeatureTemplates id={id} run={run} />
	);

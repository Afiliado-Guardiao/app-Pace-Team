import { useState } from "react";

import { useMyTeam } from "@/lib/data";

type IPostScope = "personal" | "team";

interface IUsePostScopeReturn {
	scope: IPostScope;
	// Só aparece a opção "Na equipe" para quem tem equipe
	hasTeam: boolean;
	setScope: (scope: IPostScope) => void;
}

// Postar no meu perfil ou na equipe (fica separado e com o escudo no feed)
export const usePostScope = (): IUsePostScopeReturn => {
	const { team } = useMyTeam();
	const [scope, setScope] = useState<IPostScope>("personal");
	return { scope: team ? scope : "personal", hasTeam: Boolean(team), setScope };
};

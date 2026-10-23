import { useQuery } from "@tanstack/react-query";

import { getMyInvites, IMyInvite } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

const DEMO_INVITES: IMyInvite[] = [
	{ id: "demo", teamId: "demo", teamName: "Night Runners", city: "Campinas", size: 10, members: 8 },
];

const fetchInvites = async (): Promise<IMyInvite[]> => (IS_PREVIEW ? DEMO_INVITES : getMyInvites());

// Convites de equipe que recebi e ainda não respondi.
export const useMyInvites = (): { invites: IMyInvite[] } => {
	const query = useQuery({ queryKey: DATA_KEYS.myInvites, queryFn: fetchInvites });
	return { invites: query.data ?? [] };
};

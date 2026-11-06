import { IRunCrew, useLastRunCrew } from "@/lib/data";
import { IS_PREVIEW } from "@/constants/preview";

// Percurso de cada um que correu (a mesma turma em todo celular): foto, nome
// e quanto correu. Na prévia por link fica o traçado do design.
export const usePostTrack = (): IRunCrew | undefined => {
	const crew = useLastRunCrew();
	return IS_PREVIEW ? undefined : crew;
};

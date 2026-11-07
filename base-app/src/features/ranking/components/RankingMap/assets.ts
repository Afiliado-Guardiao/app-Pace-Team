import runnerOrange from "../../../../../assets/hero/runner-1.png";
import runnerPink from "../../../../../assets/hero/runner-2.png";
import runnerRed from "../../../../../assets/hero/runner-3.png";
import runnerBlack from "../../../../../assets/hero/runner-4.png";
import runnerGreen from "../../../../../assets/hero/runner-5.png";
import trail from "../../../../../assets/ranking/trail.jpg";

// Sua equipe é sempre o corredor de camisa laranja; as outras alternam
export const MAP_ART = {
	trail,
	mine: runnerOrange,
	others: [runnerGreen, runnerPink, runnerRed, runnerBlack],
};

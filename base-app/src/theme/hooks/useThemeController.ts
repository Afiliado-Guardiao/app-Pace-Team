import { IThemeContext } from "../types";
import { getTheme } from "../utils/getTheme";

export const useThemeController = (): IThemeContext => {
	const theme = getTheme();
	return { theme };
};

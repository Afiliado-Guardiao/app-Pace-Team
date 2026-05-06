import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import { IThemeContext } from "../types";

export const useTheme = (): IThemeContext => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
};

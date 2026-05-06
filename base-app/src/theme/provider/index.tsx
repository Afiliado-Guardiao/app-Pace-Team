import React from "react";

import { ThemeContext } from "../context/ThemeContext";
import { useThemeController } from "../hooks/useThemeController";

interface IThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
	const themeController = useThemeController();

	return <ThemeContext.Provider value={themeController}>{children}</ThemeContext.Provider>;
};

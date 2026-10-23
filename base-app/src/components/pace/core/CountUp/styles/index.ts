import { TextStyle } from "react-native";

import { ITheme } from "@/theme";

export const createCountUpStyles = (theme: ITheme): { numeric: TextStyle } => ({
	numeric: { fontVariant: [...theme.pace.typography.tabularNums] },
});

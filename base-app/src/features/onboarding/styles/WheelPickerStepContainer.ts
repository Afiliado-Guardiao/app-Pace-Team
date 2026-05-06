import { ViewStyle } from "react-native";

import { ITheme } from "@/theme/types";

export const createWheelPickerStepContainerStyles = (theme: ITheme): ViewStyle => ({
	flex: 1,
	paddingHorizontal: theme.spacing.lg,
	justifyContent: "center" as const,
});

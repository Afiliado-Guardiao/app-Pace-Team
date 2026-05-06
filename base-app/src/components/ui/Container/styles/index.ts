import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IContainerProps } from "../types";

export const createContainerStyles = (theme: ITheme, props: IContainerProps): ViewStyle => {
	return {
		flex: 1,
		padding: props.padding ? theme.spacing[props.padding] : 0,
		gap: props.gap ? theme.spacing[props.gap] : 0,
		...(props.center && {
			alignItems: "center",
			justifyContent: "center",
		}),
	};
};

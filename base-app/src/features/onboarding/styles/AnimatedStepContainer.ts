import { ViewStyle } from "react-native";

interface IAnimatedStepContainerStyles {
	container: ViewStyle;
}

export const createAnimatedStepContainerStyles = (): IAnimatedStepContainerStyles => ({
	container: {
		flex: 1,
	},
});

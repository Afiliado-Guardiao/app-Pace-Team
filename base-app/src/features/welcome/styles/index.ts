import { ITheme } from "@/theme";

import { IWelcomeScreenStyles } from "../types";

export const createWelcomeScreenStyles = (theme: ITheme): IWelcomeScreenStyles => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		position: "absolute",
		top: theme.componentSizes.safeArea.topOffset,
		right: theme.spacing.xl,
		zIndex: 10,
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: theme.spacing.xl,
	},
	title: {
		textAlign: "center",
		marginBottom: theme.spacing.sm,
	},
	subtitle: {
		textAlign: "center",
	},
	footer: {
		paddingHorizontal: theme.spacing.xl,
		paddingBottom: theme.spacing["2xl"],
	},
	ctaButton: {
		width: "100%",
	},
});

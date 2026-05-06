import { ITheme } from "@/theme";

import { IProfileScreenStyles } from "../types";

export const createProfileScreenStyles = (theme: ITheme): IProfileScreenStyles => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	scrollContent: {
		paddingBottom: theme.spacing.lg,
	},
	topRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.xl,
		paddingBottom: theme.spacing.lg,
	},
	heroLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing.md,
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: theme.borderRadius.full,
		backgroundColor: theme.colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		fontSize: theme.typography.sizes.xl,
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.primaryForeground,
	},
	heroInfo: {
		flex: 1,
		gap: theme.spacing.xs,
	},
	heroName: {
		fontSize: theme.typography.sizes.xl,
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.text,
		letterSpacing: theme.typography.letterSpacing.tight,
	},
	heroEmail: {
		fontSize: theme.typography.sizes.sm,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.textSecondary,
	},
	section: {
		marginHorizontal: theme.spacing.md,
	},
	lastMenuItem: {
		borderBottomWidth: 0,
	},
});

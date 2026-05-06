import type { ITheme } from "@/theme/types";

export const createHomeStyles = (theme: ITheme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		flex: 1,
		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.lg,
		gap: theme.spacing.lg,
	},
	greetingBlock: {
		gap: theme.spacing.xs,
	},
	muted: {
		color: theme.colors.textMuted,
	},
	dataRow: {
		gap: theme.spacing.xs,
		paddingVertical: theme.spacing.xs,
	},
});

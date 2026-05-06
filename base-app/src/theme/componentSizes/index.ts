// Alturas padrão dos componentes — coerentes com spacing 4-based
export const componentSizes = {
	button: {
		sm: 36,
		md: 48,
		lg: 56,
	},

	input: {
		default: 48,
	},

	icon: {
		sm: 16,
		md: 20,
		lg: 24,
		xl: 32,
	},

	tabBar: {
		height: 56,
		iconSize: 24,
		paddingBottom: 8,
	},

	header: {
		height: 56,
	},

	modal: {
		maxWidth: 360,
	},

	safeArea: {
		topOffset: 56,
		bottomOffset: 34,
	},
} as const;

export type IComponentSizes = typeof componentSizes;

import { colors } from "@/theme/colors";
import { getTheme } from "@/theme/utils/getTheme";

describe("getTheme", () => {
	it("returns the correct colors", () => {
		const theme = getTheme();

		expect(theme.colors).toEqual(colors);
	});

	it("returns an object with all required theme keys", () => {
		const theme = getTheme();
		const expectedKeys = [
			"colors",
			"typography",
			"spacing",
			"shadows",
			"borderRadius",
			"borderWidth",
			"componentSizes",
			"animations",
		];

		expectedKeys.forEach((key) => {
			expect(theme).toHaveProperty(key);
		});
	});

	it("returns the correct background color for light theme", () => {
		const theme = getTheme();

		expect(theme.colors.background).toBe("#FFFFFF");
	});

	it("returns the correct typography", () => {
		const theme = getTheme();

		expect(theme.typography).toBeDefined();
	});

	it("returns the correct spacing", () => {
		const theme = getTheme();

		expect(theme.spacing).toBeDefined();
	});

	it("returns the correct borderRadius", () => {
		const theme = getTheme();

		expect(theme.borderRadius).toBeDefined();
	});
});

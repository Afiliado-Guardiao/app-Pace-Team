import * as Localization from "expo-localization";

import { getDeviceMetadata } from "../index";

jest.mock("expo-localization");

describe("Device Utils", () => {
	describe("getDeviceMetadata()", () => {
		it("should return device language, region and timezone", () => {
			(Localization.getLocales as jest.Mock).mockReturnValue([
				{
					languageTag: "pt-BR",
					regionCode: "BR",
				},
			]);

			(Localization.getCalendars as jest.Mock).mockReturnValue([
				{
					timeZone: "America/Sao_Paulo",
				},
			]);

			const metadata = getDeviceMetadata();

			expect(metadata.deviceLanguage).toBe("pt-BR");
			expect(metadata.deviceRegion).toBe("BR");
			expect(metadata.deviceTimezone).toBe("America/Sao_Paulo");
		});

		it("should handle missing locale data gracefully", () => {
			(Localization.getLocales as jest.Mock).mockReturnValue([{}]);
			(Localization.getCalendars as jest.Mock).mockReturnValue([{}]);

			const metadata = getDeviceMetadata();

			expect(metadata.deviceLanguage).toBeNull();
			expect(metadata.deviceRegion).toBeNull();
			expect(metadata.deviceTimezone).toBeNull();
		});

		it("should handle localization errors gracefully", () => {
			(Localization.getLocales as jest.Mock).mockImplementation(() => {
				throw new Error("Localization error");
			});

			const metadata = getDeviceMetadata();

			expect(metadata.deviceLanguage).toBeNull();
			expect(metadata.deviceRegion).toBeNull();
			expect(metadata.deviceTimezone).toBeNull();
		});
	});
});

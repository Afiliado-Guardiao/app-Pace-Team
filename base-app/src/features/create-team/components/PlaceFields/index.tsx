import React from "react";
import { View } from "react-native";

import { Input, Select } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY } from "../../constants";
import { useCreateTeam } from "../../hooks/useCreateTeam";

interface IPlaceFieldsProps {
	form: ReturnType<typeof useCreateTeam>;
}

const createPlaceFieldsStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[3.5] },
	twoCols: { flexDirection: "row" as const, gap: 10 },
	cityCol: { flex: 1.3 },
	regionCol: { flex: 1 },
});

// País, cidade e região. Em "Outra", aparece o campo para digitar.
export const PlaceFields: React.FC<IPlaceFieldsProps> = ({ form }) => {
	const { theme } = useTheme();
	const styles = createPlaceFieldsStyles(theme);

	return (
		<View style={styles.root}>
			<Select
				label={CREATE_TEAM_COPY.country}
				icon="globe"
				options={form.countryOptions}
				value={form.country}
				onChange={form.setCountry}
				testID="create-team-country"
			/>
			<View style={styles.twoCols}>
				<Select
					label={CREATE_TEAM_COPY.city}
					options={form.cityOptions}
					value={form.city.choice}
					onChange={form.city.setChoice}
					style={styles.cityCol}
					testID="create-team-city"
				/>
				<Select
					label={CREATE_TEAM_COPY.region}
					options={form.regionOptions}
					value={form.region.choice}
					onChange={form.region.setChoice}
					style={styles.regionCol}
					testID="create-team-region"
				/>
			</View>
			{form.city.isOther ? (
				<Input
					icon="map-pin"
					value={form.city.other}
					placeholder={CREATE_TEAM_COPY.otherCity}
					onChangeText={form.city.setOther}
					testID="create-team-city-other"
				/>
			) : null}
			{form.region.isOther ? (
				<Input
					icon="map"
					value={form.region.other}
					placeholder={CREATE_TEAM_COPY.otherRegion}
					onChangeText={form.region.setOther}
					testID="create-team-region-other"
				/>
			) : null}
		</View>
	);
};

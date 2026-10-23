import React from "react";
import { Pressable, Text, View } from "react-native";

import {
	Button,
	Chip,
	FloatingToast,
	GlassSurface,
	Icon,
	Input,
	Label,
	ScreenBackground,
	ScreenScroll,
	Select,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { TeamPreviewCard } from "./components/TeamPreviewCard";
import { CREATE_TEAM_COPY, REGION_OPTIONS, SIZE_OPTIONS } from "./constants";
import { useCreateTeam } from "./hooks/useCreateTeam";

const LOGO = 84;

const createCreateTeamStyles = (theme: ITheme) => {
	const { blur, colors, typography } = theme.pace;
	return {
		root: { flex: 1 },
		logoRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 16 },
		logo: {
			width: LOGO,
			height: LOGO,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: 6,
		},
		logoAppearance: {
			fill: { color: colors.glass1 },
			blur: blur.intensity.glass,
			border: null,
			rim: true,
		},
		logoDash: {
			position: "absolute" as const,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			borderRadius: 26,
			borderWidth: 1.5,
			borderStyle: "dashed" as const,
			borderColor: colors.glassBorderStrong,
		},
		logoText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textSecondary,
		},
		logoHint: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.45,
			color: colors.textTertiary,
		},
		twoCols: { flexDirection: "row" as const, gap: 10 },
		cityCol: { flex: 1.3 },
		regionCol: { flex: 1 },
		fieldLabel: {
			marginBottom: 10,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		chips: { flexDirection: "row" as const, gap: 8 },
		previewLabel: { marginTop: 6 },
	};
};

// 10 Criar equipe: escudo, dados do time, categoria e prévia.
export const CreateTeamScreen: React.FC = () => {
	const { theme } = useTheme();
	const form = useCreateTeam();
	const styles = createCreateTeamStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.citySkylineDusk} />
			<ScreenScroll bottom={40}>
				<TopBar title={CREATE_TEAM_COPY.title} onBack={form.goBack} />
				<View style={styles.logoRow}>
					<Pressable
						onPress={form.pickLogo}
						accessibilityRole="button"
						accessibilityLabel={CREATE_TEAM_COPY.logo}
						testID="create-team-logo"
					>
						<GlassSurface appearance={styles.logoAppearance} radius={26} style={styles.logo}>
							<View style={styles.logoDash} pointerEvents="none" />
							<Icon name="image-plus" size={24} color={theme.pace.colors.textSecondary} />
							<Text style={styles.logoText}>{CREATE_TEAM_COPY.logo}</Text>
						</GlassSurface>
					</Pressable>
					<Text style={styles.logoHint}>{CREATE_TEAM_COPY.logoHint}</Text>
				</View>
				<Input
					label={CREATE_TEAM_COPY.name}
					icon="flag"
					value={form.name}
					placeholder={CREATE_TEAM_COPY.namePlaceholder}
					onChangeText={form.setName}
					testID="create-team-name"
				/>
				<View style={styles.twoCols}>
					<Select
						label={CREATE_TEAM_COPY.city}
						options={form.cityOptions}
						value={form.city}
						onChange={form.setCity}
						style={styles.cityCol}
						testID="create-team-city"
					/>
					<Select
						label={CREATE_TEAM_COPY.region}
						options={REGION_OPTIONS}
						value={form.region}
						onChange={form.setRegion}
						style={styles.regionCol}
						testID="create-team-region"
					/>
				</View>
				<View>
					<Text style={styles.fieldLabel}>{CREATE_TEAM_COPY.category}</Text>
					<View style={styles.chips}>
						{SIZE_OPTIONS.map((v) => (
							<Chip
								key={v}
								selected={form.size === v}
								onPress={() => {
									form.setSize(v);
								}}
								testID={`create-team-size-${v}`}
							>
								{`${v}${CREATE_TEAM_COPY.members}`}
							</Chip>
						))}
					</View>
				</View>
				<Input
					label={CREATE_TEAM_COPY.captain}
					icon="crown"
					value={form.captain}
					onChangeText={form.setCaptain}
					testID="create-team-captain"
				/>
				<Label style={styles.previewLabel}>{CREATE_TEAM_COPY.preview}</Label>
				<TeamPreviewCard name={form.name} city={form.city} size={form.slots} />
				<Button
					size="lg"
					fullWidth
					iconRight="arrow-right"
					disabled={form.isSubmitting}
					onPress={form.submit}
					testID="create-team-submit"
				>
					{CREATE_TEAM_COPY.submit}
				</Button>
			</ScreenScroll>
			<FloatingToast toast={form.toast} />
		</View>
	);
};

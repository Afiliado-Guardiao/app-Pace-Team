import React from "react";
import { View } from "react-native";

import {
	Button,
	FloatingToast,
	Input,
	Label,
	ScreenBackground,
	ScreenScroll,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { EmblemPicker } from "./components/EmblemPicker";
import { LeaveTeamSheet } from "./components/LeaveTeamSheet";
import { PlaceFields } from "./components/PlaceFields";
import { SizeField } from "./components/SizeField";
import { TeamPreviewCard } from "./components/TeamPreviewCard";
import { CREATE_TEAM_COPY } from "./constants";
import { useCreateTeam } from "./hooks/useCreateTeam";

const createCreateTeamStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	previewLabel: { marginTop: theme.pace.spacing[1] },
});

// 10 Criar equipe: escudo, dados do time, categoria e prévia.
export const CreateTeamScreen: React.FC = () => {
	const { theme } = useTheme();
	const form = useCreateTeam();
	const styles = createCreateTeamStyles(theme);
	const title = form.isEdit ? CREATE_TEAM_COPY.editTitle : CREATE_TEAM_COPY.title;
	const submitLabel = form.isEdit ? CREATE_TEAM_COPY.editSubmit : CREATE_TEAM_COPY.submit;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.citySkylineDusk} />
			<ScreenScroll bottom={40}>
				<TopBar title={title} onBack={form.goBack} />
				<EmblemPicker logo={form.logo} uri={form.logoUri} />
				<Input
					label={CREATE_TEAM_COPY.name}
					icon="flag"
					value={form.name}
					placeholder={CREATE_TEAM_COPY.namePlaceholder}
					onChangeText={form.setName}
					testID="create-team-name"
				/>
				<PlaceFields form={form} />
				<SizeField field={form.teamSize} />
				<Input
					label={CREATE_TEAM_COPY.captain}
					icon="crown"
					value={form.captain}
					onChangeText={form.setCaptain}
					testID="create-team-captain"
				/>
				<Label style={styles.previewLabel}>{CREATE_TEAM_COPY.preview}</Label>
				<TeamPreviewCard
					name={form.name}
					city={form.city.value}
					size={form.slots}
					logoUri={form.logoUri}
				/>
				<Button
					size="lg"
					fullWidth
					iconRight="arrow-right"
					disabled={form.isSubmitting}
					onPress={form.submit}
					testID="create-team-submit"
				>
					{submitLabel}
				</Button>
			</ScreenScroll>
			<LeaveTeamSheet leave={form.leave} />
			<FloatingToast toast={form.toast} />
		</View>
	);
};

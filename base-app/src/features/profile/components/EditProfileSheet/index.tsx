import React from "react";
import { Text, View } from "react-native";

import { Avatar, Button, Input, Select, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { EDIT_COPY } from "../../constants";
import { useEditProfile } from "../../hooks/useEditProfile";

interface IEditProfileSheetProps {
	edit: ReturnType<typeof useEditProfile>;
}

const AVATAR = 84;

const createEditProfileStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		form: { gap: spacing[3] },
		photo: { alignItems: "center" as const, gap: spacing[2] },
		row: { flexDirection: "row" as const, gap: spacing[2] },
		cell: { flex: 1 },
		stateCell: { width: 110 },
		error: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.statusDanger,
		},
	};
};

// Folha "Editar perfil": foto da galeria, nome, @usuário, cidade e estado.
export const EditProfileSheet: React.FC<IEditProfileSheetProps> = ({ edit }) => {
	const { theme } = useTheme();
	const styles = createEditProfileStyles(theme);

	return (
		<Sheet
			open={edit.isOpen}
			title={EDIT_COPY.title}
			onClose={edit.close}
			actions={
				<>
					<Button fullWidth disabled={edit.isSaving} onPress={edit.save} testID="profile-edit-save">
						{EDIT_COPY.save}
					</Button>
					<Button fullWidth variant="ghost" onPress={edit.close} testID="profile-edit-cancel">
						{EDIT_COPY.cancel}
					</Button>
				</>
			}
		>
			<View style={styles.form}>
				<View style={styles.photo}>
					<Avatar name={edit.form.name} src={edit.photo ?? undefined} size={AVATAR} ring />
					<Button
						size="sm"
						variant="glass"
						icon="image"
						onPress={edit.pickPhoto}
						testID="profile-edit-photo"
					>
						{EDIT_COPY.changePhoto}
					</Button>
				</View>
				<Input
					label={EDIT_COPY.name}
					value={edit.form.name}
					placeholder={EDIT_COPY.namePlaceholder}
					onChangeText={(text) => {
						edit.setField("name", text);
					}}
					testID="profile-edit-name"
					accessibilityLabel={EDIT_COPY.name}
				/>
				<Input
					label={EDIT_COPY.handle}
					icon="at-sign"
					value={edit.form.handle}
					placeholder={EDIT_COPY.handlePlaceholder}
					hint={EDIT_COPY.handleHint}
					onChangeText={(text) => {
						edit.setField("handle", text);
					}}
					testID="profile-edit-handle"
					accessibilityLabel={EDIT_COPY.handle}
				/>
				<View style={styles.row}>
					<Select
						label={EDIT_COPY.city}
						options={edit.cityOptions}
						value={edit.form.city}
						onChange={(value) => {
							edit.setField("city", value);
						}}
						style={styles.cell}
						testID="profile-edit-city"
					/>
					<Select
						label={EDIT_COPY.state}
						options={edit.stateOptions}
						value={edit.form.state}
						onChange={(value) => {
							edit.setField("state", value);
						}}
						style={styles.stateCell}
						testID="profile-edit-state"
					/>
				</View>
				{edit.error ? <Text style={styles.error}>{edit.error}</Text> : null}
			</View>
		</Sheet>
	);
};

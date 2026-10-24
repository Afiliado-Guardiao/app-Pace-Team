import React from "react";
import { Text } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { DELETE_COPY } from "../../constants";

interface IDeleteAccountSheetProps {
	open: boolean;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

const createDeleteAccountStyles = (theme: ITheme) => ({
	body: {
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.ui,
		lineHeight: theme.pace.typography.sizes.ui * 1.45,
		color: theme.pace.colors.textSecondary,
	},
});

// Confirmação de "Excluir conta": explica o que some e pede um segundo toque.
export const DeleteAccountSheet: React.FC<IDeleteAccountSheetProps> = ({
	open,
	isDeleting,
	onConfirm,
	onClose,
}) => {
	const { theme } = useTheme();
	const styles = createDeleteAccountStyles(theme);

	return (
		<Sheet
			open={open}
			title={DELETE_COPY.title}
			onClose={onClose}
			actions={
				<>
					<Button
						fullWidth
						icon="trash-2"
						disabled={isDeleting}
						onPress={onConfirm}
						testID="profile-delete-confirm"
					>
						{DELETE_COPY.confirm}
					</Button>
					<Button fullWidth variant="ghost" onPress={onClose} testID="profile-delete-cancel">
						{DELETE_COPY.cancel}
					</Button>
				</>
			}
		>
			<Text style={styles.body}>{DELETE_COPY.body}</Text>
		</Sheet>
	);
};

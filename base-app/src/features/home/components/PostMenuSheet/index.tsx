import React from "react";
import { Text, View } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { POST_MENU_COPY, REPORT_REASONS } from "../../constants";
import { usePostMenu } from "../../hooks/usePostMenu";

interface IPostMenuSheetProps {
	menu: ReturnType<typeof usePostMenu>;
}

const createPostMenuStyles = (theme: ITheme) => ({
	list: { gap: theme.pace.spacing[2] },
	body: {
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.sm,
		lineHeight: theme.pace.typography.sizes.sm * 1.5,
		color: theme.pace.colors.textSecondary,
	},
});

// Opções do post: apagar (meu) ou denunciar / bloquear (de outra pessoa).
export const PostMenuSheet: React.FC<IPostMenuSheetProps> = ({ menu }) => {
	const { theme } = useTheme();
	const styles = createPostMenuStyles(theme);
	const post = menu.post;
	const isMine = Boolean(post?.isMine);
	const isReport = menu.step === "report";
	const firstName = post?.name.split(" ")[0] ?? "";

	return (
		<Sheet
			open={Boolean(post)}
			title={isReport ? POST_MENU_COPY.reportTitle : POST_MENU_COPY.title}
			onClose={menu.close}
			actions={
				<Button fullWidth variant="ghost" onPress={menu.close} testID="post-menu-cancel">
					{POST_MENU_COPY.cancel}
				</Button>
			}
		>
			<View style={styles.list}>
				{isReport ? <Text style={styles.body}>{POST_MENU_COPY.reportBody}</Text> : null}
				{isReport
					? REPORT_REASONS.map((r) => (
							<Button
								key={r.value}
								fullWidth
								variant="glass"
								disabled={menu.isBusy}
								onPress={() => {
									menu.report(r.value);
								}}
								testID={`post-report-${r.value}`}
							>
								{r.label}
							</Button>
						))
					: null}
				{!isReport && isMine ? (
					<Button
						fullWidth
						variant="glass"
						icon="trash-2"
						disabled={menu.isBusy}
						onPress={menu.remove}
						testID="post-menu-delete"
					>
						{POST_MENU_COPY.remove}
					</Button>
				) : null}
				{!isReport && !isMine ? (
					<>
						<Button
							fullWidth
							variant="glass"
							icon="flag"
							onPress={menu.showReasons}
							testID="post-menu-report"
						>
							{POST_MENU_COPY.report}
						</Button>
						<Button
							fullWidth
							variant="glass"
							icon="ban"
							disabled={menu.isBusy}
							onPress={menu.block}
							testID="post-menu-block"
						>
							{`${POST_MENU_COPY.block}${firstName}`}
						</Button>
					</>
				) : null}
			</View>
		</Sheet>
	);
};

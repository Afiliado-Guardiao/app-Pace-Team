import React from "react";
import { Pressable, Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	Label,
	ScreenBackground,
	ScreenScroll,
	Sheet,
	Switch,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { NotificationItem } from "./components/NotificationItem";
import { NOTIFICATION_PREFS, NOTIFICATIONS_COPY } from "./constants";
import { useNotificationsScreen } from "./hooks/useNotificationsScreen";

const LABEL_TOP = 6;

const createNotificationsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		bar: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
		},
		count: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.orange[400],
		},
		label: { marginTop: LABEL_TOP },
		prefs: { gap: spacing[4], marginTop: spacing[1] },
	};
};

// 16 Notificações: virada, convites, corridas do time e resultados.
export const NotificationsScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useNotificationsScreen();
	const styles = createNotificationsStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground />
			<ScreenScroll>
				<TopBar
					title={NOTIFICATIONS_COPY.title}
					onBack={screen.goBack}
					right={{
						icon: "settings-2",
						label: NOTIFICATIONS_COPY.prefsTitle,
						onPress: screen.openPrefs,
					}}
				/>
				<View style={styles.bar}>
					<Text style={styles.count}>
						{screen.unreadCount}
						{NOTIFICATIONS_COPY.unread}
					</Text>
					<Pressable
						onPress={screen.markAllRead}
						accessibilityRole="button"
						testID="notifications-mark-all"
					>
						<Text style={styles.link}>{NOTIFICATIONS_COPY.markAll}</Text>
					</Pressable>
				</View>
				{screen.isEmpty ? <Text style={styles.count}>{NOTIFICATIONS_COPY.empty}</Text> : null}
				{screen.groups.flatMap((group) => [
					<Label key={group} style={styles.label}>
						{group}
					</Label>,
					...screen.items
						.filter((item) => item.group === group)
						.map((item) => (
							<NotificationItem
								key={item.id}
								item={item}
								onOpen={screen.openItem}
								onInvite={screen.answerInvite}
							/>
						)),
				])}
			</ScreenScroll>
			<Sheet
				open={screen.isPrefsOpen}
				onClose={screen.closePrefs}
				title={NOTIFICATIONS_COPY.prefsTitle}
				actions={
					<Button fullWidth onPress={screen.closePrefs}>
						{NOTIFICATIONS_COPY.save}
					</Button>
				}
			>
				<View style={styles.prefs}>
					{NOTIFICATION_PREFS.map((pref) => (
						<Switch key={pref.label} label={pref.label} defaultChecked={pref.on} />
					))}
				</View>
			</Sheet>
			<FloatingToast toast={screen.toast} />
		</View>
	);
};

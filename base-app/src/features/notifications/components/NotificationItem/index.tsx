import React from "react";
import { Pressable, Text, View } from "react-native";

import { Button, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { INotification } from "@/lib/pace";

import { NOTIFICATIONS_COPY } from "../../constants";

import { createNotificationItemStyles } from "./styles";

interface INotificationItemProps {
	item: INotification;
	onOpen: (item: INotification) => void;
	onInvite: (item: INotification, accepted: boolean) => void;
}

const ICON_SIZE = 19;

// Um aviso: ícone no tom do evento, título, hora, detalhe e (se convite) ações.
export const NotificationItem: React.FC<INotificationItemProps> = ({ item, onOpen, onInvite }) => {
	const { theme } = useTheme();
	const styles = createNotificationItemStyles(theme, item);

	return (
		<Pressable
			onPress={() => {
				onOpen(item);
			}}
			accessibilityRole="button"
			accessibilityLabel={item.title}
			testID={`notification-${item.id}`}
		>
			<GlassSurface appearance={styles.appearance} radius={theme.pace.radii.row} style={styles.row}>
				<View style={styles.iconDot}>
					<Icon name={item.icon} size={ICON_SIZE} color={styles.toneColor} />
				</View>
				<View style={styles.body}>
					<View style={styles.titleRow}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.time}>{item.time}</Text>
					</View>
					<Text style={styles.sub}>{item.sub}</Text>
					{item.invite ? (
						<View style={styles.actions}>
							<Button
								size="sm"
								onPress={() => {
									onInvite(item, true);
								}}
							>
								{NOTIFICATIONS_COPY.accept}
							</Button>
							<Button
								size="sm"
								variant="glass"
								onPress={() => {
									onInvite(item, false);
								}}
							>
								{NOTIFICATIONS_COPY.decline}
							</Button>
						</View>
					) : null}
				</View>
				{item.unread ? <View style={styles.unreadDot} /> : null}
			</GlassSurface>
		</Pressable>
	);
};

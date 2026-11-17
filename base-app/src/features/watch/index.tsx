import React from "react";
import { Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	Icon,
	InfoNote,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
	TopBar,
} from "@/components/pace";
import { useTheme } from "@/theme";

import { BrandSteps } from "./components/BrandSteps";
import { WatchStatus } from "./components/WatchStatus";
import { WATCH_COPY } from "./constants";
import { useWatchScreen } from "./hooks/useWatchScreen";
import { createWatchStyles } from "./styles";

const HERO_ICON = 26;

// Relógio e Apple Saúde: as corridas que o relógio salva no app Saúde entram
// no PACE TEAM (histórico e pontos), a partir do dia em que conectou.
export const WatchScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useWatchScreen();
	const styles = createWatchStyles(theme);
	const syncLabel = screen.isBusy ? WATCH_COPY.syncing : WATCH_COPY.syncNow;
	const connectLabel = screen.isBusy ? WATCH_COPY.connecting : WATCH_COPY.connect;

	return (
		<View style={styles.root}>
			<ScreenBackground />
			<ScreenScroll>
				<TopBar title={WATCH_COPY.title} onBack={screen.goBack} />
				<View style={styles.body}>
					<View style={styles.hero}>
						<View style={styles.heroIcon}>
							<Icon name="watch" size={HERO_ICON} color={theme.pace.colors.textPrimary} />
						</View>
						<Text style={styles.heroTitle}>{WATCH_COPY.heroTitle}</Text>
						<Text style={styles.text}>{WATCH_COPY.heroBody}</Text>
					</View>
					{screen.isConnected ? (
						<View style={styles.actions}>
							<WatchStatus
								since={screen.since}
								lastSync={screen.lastSync}
								importedCount={screen.importedCount}
							/>
							<Button
								fullWidth
								icon="refresh-cw"
								disabled={screen.isBusy}
								onPress={screen.syncNow}
								testID="watch-sync-now"
							>
								{syncLabel}
							</Button>
							<Button
								fullWidth
								variant="ghost"
								onPress={screen.disconnect}
								testID="watch-disconnect"
							>
								{WATCH_COPY.disconnect}
							</Button>
						</View>
					) : (
						<Button
							fullWidth
							icon="heart-pulse"
							disabled={screen.isBusy}
							onPress={screen.connect}
							testID="watch-connect"
						>
							{connectLabel}
						</Button>
					)}
					<SectionHeader title={WATCH_COPY.brandsTitle} />
					<BrandSteps />
					<View style={styles.notes}>
						<InfoNote icon="trophy">{WATCH_COPY.rules}</InfoNote>
						<InfoNote icon="shield-check">{WATCH_COPY.privacy}</InfoNote>
						{screen.isConnected ? (
							<InfoNote icon="settings">{WATCH_COPY.checkAccess}</InfoNote>
						) : null}
					</View>
				</View>
			</ScreenScroll>
			<FloatingToast toast={screen.toast} />
		</View>
	);
};

import React from "react";
import { ScrollView, Text, View } from "react-native";

import {
	CakeIcon,
	EnvelopeSimpleIcon,
	LockIcon,
	UserIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LanguageSwitcher } from "@/components/shared";
import { MenuItem, Section } from "@/components/ui";
import { useTheme } from "@/theme";

import { DangerZone, ReferralSection } from "./components";
import { useProfileScreen } from "./hooks";
import { createProfileScreenStyles } from "./styles";

export const ProfileScreen: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("profile");
	const insets = useSafeAreaInsets();
	const { user, editName, editEmail, editBirthday, editPassword, handleLogout, handleDeleteAccount } =
		useProfileScreen();

	const styles = createProfileScreenStyles(theme);

	const initials = user?.name
		? user.name
				.split(" ")
				.slice(0, 2)
				.filter(Boolean)
			.map((w) => w[0].toUpperCase())
				.join("")
		: "U";

	const formattedBirthday = user?.birthday
		? new Date(user.birthday).toLocaleDateString(undefined, {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
		  })
		: undefined;

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: insets.top,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				contentInsetAdjustmentBehavior="automatic"
				showsVerticalScrollIndicator={false}
			>
				{/* Hero: avatar + info à esquerda, LanguageSwitcher à direita */}
				<View style={styles.topRow}>
					<View style={styles.heroLeft}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{initials}</Text>
						</View>
						<View style={styles.heroInfo}>
							{user?.name ? (
								<Text style={styles.heroName} testID="profile-name" numberOfLines={1}>
									{user.name}
								</Text>
							) : null}
							{user?.email ? (
								<Text style={styles.heroEmail} testID="profile-email" numberOfLines={1}>
									{user.email}
								</Text>
							) : null}
						</View>
					</View>
					<LanguageSwitcher />
				</View>

				<Section title={t("sections.personal.title")} style={styles.section}>
					<MenuItem
						testID="menu-name"
						icon={UserIcon}
						label={t("sections.personal.name")}
						value={user?.name ?? undefined}
						onPress={editName}
					/>
					<MenuItem
						testID="menu-email"
						icon={EnvelopeSimpleIcon}
						label={t("sections.personal.email")}
						value={user?.email ?? undefined}
						onPress={editEmail}
					/>
					<MenuItem
						testID="menu-birthday"
						icon={CakeIcon}
						label={t("sections.personal.birthday")}
						value={formattedBirthday}
						onPress={editBirthday}
					/>
					<MenuItem
						testID="menu-password"
						icon={LockIcon}
						label={t("sections.personal.password")}
						onPress={editPassword}
						style={styles.lastMenuItem}
					/>
				</Section>

				<ReferralSection />

				<DangerZone onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
			</ScrollView>
		</View>
	);
};

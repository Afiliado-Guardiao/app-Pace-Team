import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { CheckCircleIcon, CopyIcon, UsersIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme";
import { normalizeReferralCode } from "@/lib/referral";

import { useReferralSection } from "../../hooks/useReferralSection";

import { createReferralSectionStyles } from "./styles";

export const ReferralSection: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("profile");
	const { stats, isLoading, isApplying, applyCode, copyMyCode } = useReferralSection();
	const [codeInput, setCodeInput] = useState("");

	const styles = createReferralSectionStyles(theme);

	if (isLoading || !stats) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{t("referral.title")}</Text>
			</View>
		);
	}

	const handleApply = (): void => {
		const code = normalizeReferralCode(codeInput);
		if (code.length < 4) return;
		applyCode(code);
		setCodeInput("");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t("referral.title").toUpperCase()}</Text>

			{/* Código grande + botão copiar */}
			<View style={styles.myCodeRow}>
				<Text style={styles.myCodeText} testID="referral-my-code">
					{stats.myCode}
				</Text>
				<Pressable
					testID="btn-copy-referral"
					accessibilityLabel={t("referral.copy")}
					onPress={copyMyCode}
					style={({ pressed }) => [styles.copyIconButton, pressed && { opacity: 0.6 }]}
				>
					<CopyIcon size={18} color={theme.colors.textSecondary} weight="regular" />
				</Pressable>
			</View>

			{/* Código usado ou input de aplicar */}
			{stats.usedCode !== null ? (
				<View style={styles.usedCodeRow} testID="referral-used-code">
					<CheckCircleIcon size={14} color={theme.colors.success} weight="fill" />
					<Text style={styles.usedCodeText}>
						{t("referral.usedCode", { code: stats.usedCode })}
					</Text>
				</View>
			) : (
				<View style={styles.inputRow}>
					<TextInput
						testID="input-apply-referral"
						style={styles.input}
						value={codeInput}
						onChangeText={(v) => { setCodeInput(normalizeReferralCode(v)); }}
						placeholder={t("referral.applyPlaceholder")}
						placeholderTextColor={theme.colors.textMuted}
						autoCapitalize="characters"
						autoCorrect={false}
						maxLength={20}
					/>
					<Pressable
						testID="btn-apply-referral"
						accessibilityLabel={t("referral.applyCta")}
						onPress={handleApply}
						disabled={isApplying}
						style={({ pressed }) => [
							styles.applyButton,
							(pressed || isApplying) && { opacity: 0.6 },
						]}
					>
						<Text style={styles.applyButtonText}>{t("referral.applyCta")}</Text>
					</Pressable>
				</View>
			)}

			{/* Contador de indicados */}
			<View style={styles.countRow} testID="referral-count">
				<UsersIcon size={13} color={theme.colors.textSecondary} weight="regular" />
				<Text style={styles.countText}>
					{t("referral.count", { count: stats.referralsCount })}
				</Text>
			</View>
		</View>
	);
};

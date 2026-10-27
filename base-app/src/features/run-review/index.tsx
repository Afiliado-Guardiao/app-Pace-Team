import React from "react";
import { Modal, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Badge, Button, GlassSurface, IconButton } from "@/components/pace";
import { RunMap } from "@/components/shared/RunMap";
import { useTheme } from "@/theme";

import { ReviewStats } from "./components/ReviewStats";
import { ReviewTeam } from "./components/ReviewTeam";
import { RUN_REVIEW_COPY, RUN_STATUS_BADGE } from "./constants";
import { useRunReview } from "./hooks/useRunReview";
import { createRunReviewStyles } from "./styles";
import { SHAKE_ANIMATION } from "./styles/shake";

// Aviso ao abrir o app depois de correr com o Buddy: percurso, ficha técnica
// (e a da equipe, se correu junto) e validar, descartar, compartilhar e postar.
export const RunReviewPopup: React.FC = () => {
	const { theme } = useTheme();
	const review = useRunReview();
	const styles = createRunReviewStyles(theme);
	const badge = RUN_STATUS_BADGE[review.status];
	const confirmLabel = review.isInvalid ? RUN_REVIEW_COPY.understood : RUN_REVIEW_COPY.validate;

	if (!review.isOpen) return null;

	return (
		<Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={review.close}>
			<View style={styles.backdrop}>
				<Animated.View style={review.isConfirming ? null : SHAKE_ANIMATION}>
					<GlassSurface appearance={styles.appearance} radius={28} style={styles.card}>
						<View style={styles.header}>
							<View style={styles.titles}>
								<Text style={styles.title}>{RUN_REVIEW_COPY.title}</Text>
								<Text style={styles.meta}>{review.date}</Text>
							</View>
							<IconButton
								icon="x"
								size={36}
								label={RUN_REVIEW_COPY.close}
								onPress={review.close}
								testID="run-review-close"
							/>
						</View>
						<View style={styles.map} pointerEvents="none">
							<RunMap route={review.route} interactive={false} />
						</View>
						<View style={styles.statusRow}>
							<Badge tone={badge.tone} dot>
								{badge.label}
							</Badge>
							<Text style={styles.points}>{`+${String(review.points)} pts`}</Text>
						</View>
						<ReviewStats stats={review.stats} />
						{review.isInvalid ? <Text style={styles.note}>{RUN_REVIEW_COPY.invalidNote}</Text> : null}
						{review.team.length > 0 ? <ReviewTeam members={review.team} /> : null}
						{review.isConfirming ? (
							<>
								<Text style={styles.title}>{RUN_REVIEW_COPY.confirmTitle}</Text>
								<Text style={styles.meta}>{RUN_REVIEW_COPY.confirmBody}</Text>
								<View style={styles.row}>
									<Button
										variant="glass"
										style={styles.action}
										onPress={review.cancelDiscard}
										testID="run-review-keep"
									>
										{RUN_REVIEW_COPY.confirmNo}
									</Button>
									<Button
										variant="light"
										style={styles.action}
										disabled={review.isDiscarding}
										onPress={review.discard}
										testID="run-review-discard-yes"
									>
										{RUN_REVIEW_COPY.confirmYes}
									</Button>
								</View>
							</>
						) : (
							<>
								<View style={styles.row}>
									<Button
										variant="glass"
										icon="trash-2"
										style={styles.action}
										onPress={review.askDiscard}
										testID="run-review-discard"
									>
										{RUN_REVIEW_COPY.discard}
									</Button>
									<Button
										icon="check"
										style={styles.action}
										onPress={review.validate}
										testID="run-review-validate"
									>
										{confirmLabel}
									</Button>
								</View>
								<View style={styles.row}>
									<Button
										variant="glass"
										size="sm"
										icon="share-2"
										style={styles.action}
										onPress={review.share}
										testID="run-review-share"
									>
										{RUN_REVIEW_COPY.share}
									</Button>
									<Button
										variant="glass"
										size="sm"
										icon="camera"
										style={styles.action}
										onPress={review.post}
										testID="run-review-post"
									>
										{RUN_REVIEW_COPY.post}
									</Button>
								</View>
							</>
						)}
					</GlassSurface>
				</Animated.View>
			</View>
		</Modal>
	);
};

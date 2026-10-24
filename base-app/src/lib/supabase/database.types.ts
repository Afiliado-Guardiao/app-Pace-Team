// Tipos do schema do banco (espelham base-supabase/supabase/migrations).
// Para um projeto real, regenere com: `supabase gen types typescript`.
// Mantido enxuto: apenas o que o app consome (profiles, onboardings, RPCs).

import {
	IAthleteResult,
	IFeedRow,
	IMyInvite,
	IMyStats,
	IPrivacySettings,
	IRunStatusDb,
	ITeamDetails,
	ITeamRankingEntry,
} from "./pace.types";
import { IMyChallenges, INotificationRow, ITeamAchievements } from "./progress.types";
import { ITeamLastRuns, ITeamOnlineMate, IVirada } from "./teamLive.types";

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					name: string;
					birthday: string | null;
					referral_code: string;
					referred_by_code: string | null;
					referred_by_id: string | null;
					is_premium: boolean;
					handle: string | null;
					city: string | null;
					state: string | null;
					avatar_path: string | null;
					privacy: IPrivacySettings;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					name?: string;
					birthday?: string | null;
					referral_code?: string;
					is_premium?: boolean;
				};
				Update: {
					name?: string;
					birthday?: string | null;
					handle?: string | null;
					city?: string | null;
					state?: string | null;
					avatar_path?: string | null;
					privacy?: IPrivacySettings;
				};
				Relationships: [];
			};
			onboardings: {
				Row: {
					id: string;
					user_id: string;
					name: string | null;
					email: string | null;
					birthday: string | null;
					completed: boolean;
					completed_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name?: string | null;
					email?: string | null;
					birthday?: string | null;
					completed?: boolean;
					completed_at?: string | null;
				};
				Update: {
					name?: string | null;
					email?: string | null;
					birthday?: string | null;
					completed?: boolean;
					completed_at?: string | null;
				};
				Relationships: [];
			};
			runs: {
				Row: {
					id: string;
					user_id: string;
					team_id: string | null;
					mode: string;
					started_at: string;
					finished_at: string;
					duration_s: number;
					distance_m: number;
					route: unknown;
					status: IRunStatusDb;
					points: number;
					created_at: string;
				};
				Insert: {
					mode?: string;
					started_at: string;
					finished_at: string;
					duration_s: number;
					distance_m: number;
					route?: unknown;
				};
				Update: Record<string, never>;
				Relationships: [];
			};
			posts: {
				Row: {
					id: string;
					user_id: string;
					team_id: string | null;
					run_id: string | null;
					image_path: string | null;
					sample: number | null;
					seconds: number;
					km: number;
					layers: unknown;
					caption: string;
					created_at: string;
				};
				Insert: {
					run_id?: string | null;
					image_path?: string | null;
					sample?: number | null;
					seconds?: number;
					km?: number;
					layers?: unknown;
					caption?: string;
				};
				Update: Record<string, never>;
				Relationships: [];
			};
			post_likes: {
				Row: { post_id: string; user_id: string; created_at: string };
				Insert: { post_id: string; user_id: string };
				Update: Record<string, never>;
				Relationships: [];
			};
			teams: {
				Row: { id: string; name: string; captain_id: string | null; logo_url: string | null };
				// Equipes são criadas pela RPC create_team
				Insert: Record<string, never>;
				Update: { logo_url?: string | null };
				Relationships: [];
			};
			buddy_profiles: {
				Row: {
					user_id: string;
					goals: number;
					color: string;
					last_free: string;
					equipped: string[];
					alarm_time: string | null;
					alarm_days: number[];
					updated_at: string;
				};
				Insert: {
					user_id?: string;
					color?: string;
					last_free?: string;
					equipped?: string[];
					alarm_time?: string | null;
					alarm_days?: number[];
				};
				Update: {
					color?: string;
					last_free?: string;
					equipped?: string[];
					alarm_time?: string | null;
					alarm_days?: number[];
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: {
			apply_referral_code: {
				Args: { p_code: string };
				Returns: { usedCode: string; referrer: { name: string } };
			};
			get_referral_stats: {
				Args: Record<string, never>;
				Returns: { myCode: string; usedCode: string | null; referralsCount: number };
			};
			delete_account: {
				Args: Record<string, never>;
				Returns: undefined;
			};
			create_team: {
				Args: { p_name: string; p_city: string; p_region: string; p_size: number };
				Returns: string;
			};
			join_team: { Args: { p_team_id: string }; Returns: undefined };
			join_team_by_code: { Args: { p_code: string }; Returns: string };
			leave_team: { Args: Record<string, never>; Returns: undefined };
			invite_to_team: { Args: { p_user_id: string }; Returns: undefined };
			respond_invite: { Args: { p_invite_id: string; p_accept: boolean }; Returns: undefined };
			get_my_invites: { Args: Record<string, never>; Returns: IMyInvite[] };
			search_athletes: { Args: { p_query: string }; Returns: IAthleteResult[] };
			get_team_ranking: {
				Args: { p_size: number; p_scope?: string };
				Returns: ITeamRankingEntry[];
			};
			get_team: { Args: { p_team_id: string }; Returns: ITeamDetails | null };
			get_my_team: { Args: Record<string, never>; Returns: ITeamDetails | null };
			get_my_stats: { Args: Record<string, never>; Returns: IMyStats };
			buddy_complete_goal: {
				Args: Record<string, never>;
				Returns: { goals: number; unlocked: string | null };
			};
			buddy_register_device: { Args: { p_token: string; p_platform?: string }; Returns: undefined };
			get_feed: { Args: { p_limit?: number }; Returns: IFeedRow[] };
			get_virada: { Args: Record<string, never>; Returns: IVirada | null };
			get_team_last_runs: { Args: Record<string, never>; Returns: ITeamLastRuns | null };
			get_team_online: { Args: Record<string, never>; Returns: ITeamOnlineMate[] };
			get_notifications: { Args: Record<string, never>; Returns: INotificationRow[] };
			report_post: { Args: { p_post_id: string; p_reason: string }; Returns: undefined };
			block_user: { Args: { p_user_id: string }; Returns: undefined };
			mark_notifications_read: { Args: { p_ids?: string[] | null }; Returns: undefined };
			get_my_challenges: { Args: Record<string, never>; Returns: IMyChallenges };
			get_team_achievements: { Args: { p_team_id: string }; Returns: ITeamAchievements };
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}

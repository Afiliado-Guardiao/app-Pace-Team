// Tipos do schema do banco (espelham base-supabase/supabase/migrations).
// Para um projeto real, regenere com: `supabase gen types typescript`.
// Mantido enxuto: apenas o que o app consome (profiles, onboardings, RPCs).

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
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}

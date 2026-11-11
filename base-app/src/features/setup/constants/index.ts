import { IBuddyAccessoryId } from "@/lib/buddy/constants";

// Etapas do onboarding depois de criar a conta (telas 03 a 08 do Cloud Design)
export type ISetupStep =
	| "profile"
	| "acc"
	| "call"
	| "care"
	| "goal"
	| "team"
	| "invites"
	| "pro"
	| "done";

export const SETUP_STEPS: readonly ISetupStep[] = [
	"profile",
	"acc",
	"call",
	"care",
	"goal",
	"team",
	"invites",
	"pro",
	"done",
];

// Barra de 7 segmentos (02 conta · 03 Buddy · 04 objetivo · 05 equipe ·
// 06 convites · 07 Team Pro · 08 conclusão): qual segmento cada etapa acende
export const SEGMENTS = 7;
export const SEGMENT_OF: Record<ISetupStep, number> = {
	profile: 1,
	acc: 2,
	call: 2,
	care: 2,
	goal: 3,
	team: 4,
	invites: 5,
	pro: 6,
	done: 7,
};

// Guarda o progresso no aparelho (fechou o app, volta na mesma etapa)
export const SETUP_KEYS = {
	step: "setupStep",
	goal: "setupGoal",
	done: "setupDone",
	// "1" = escolheu correr sozinho por enquanto
	solo: "setupSolo",
	// Prévia por link: nome e tamanho da equipe criada (não vai ao servidor)
	teamName: "setupTeamName",
	teamSize: "setupTeamSize",
	// Nome e @ do 02 (o resumo final usa antes do login)
	name: "setupName",
	handle: "setupHandle",
	// "1" = quis o Team Pro no onboarding: abre a assinatura depois do login
	wantsPro: "setupWantsPro",
} as const;

// 3a · os 8 acessórios da grade 4×2 (a coroa é só do líder)
export const SETUP_ACCESSORIES: readonly { id: IBuddyAccessoryId; name: string }[] = [
	{ id: "oculos", name: "Óculos escuros" },
	{ id: "grau", name: "Óculos de grau" },
	{ id: "faixa", name: "Faixa" },
	{ id: "bone", name: "Boné" },
	{ id: "boneTras", name: "Boné p/ trás" },
	{ id: "coroa", name: "Coroa" },
	{ id: "aureola", name: "Auréola" },
	{ id: "capa", name: "Capa" },
];

export type IGoalId = "start" | "pace" | "rank" | "friends";

export const GOALS: readonly {
	id: IGoalId;
	icon: string;
	title: string;
	sub: string;
	bubble: string;
}[] = [
	{
		id: "start",
		icon: "footprints",
		title: "Começar a correr",
		sub: "Do zero, no seu ritmo",
		bubble: "Todo mundo começa do primeiro km!",
	},
	{
		id: "pace",
		icon: "gauge",
		title: "Melhorar meu pace",
		sub: "Mais rápido a cada semana",
		bubble: "Vamos baixar esse pace juntos.",
	},
	{
		id: "rank",
		icon: "trophy",
		title: "Subir no ranking",
		sub: "Competir de verdade",
		bubble: "Rumo ao cume da montanha!",
	},
	{
		id: "friends",
		icon: "users",
		title: "Correr com amigos",
		sub: "Treinar em grupo",
		bubble: "Correr junto é mais divertido.",
	},
];

// Texto do convite (o mesmo da tela Convidar)
export const INVITE_SHARE = {
	a: "Bora correr com a ",
	b: " no PACE TEAM? No app, vá em Equipe > Entrar em uma equipe e use o código ",
	link: "paceteam://invite/",
	copied: "Copiado!",
	sent: "Convite enviado",
} as const;

export const SETUP_COPY = {
	back: "Voltar",
	next: "Continuar",
	// 02
	profileBubble: "Oi! Como posso te chamar?",
	profileTitle: "Crie sua conta",
	profileSub: "Rapidinho. Só o essencial.",
	profileSection: "SEU PERFIL",
	profileName: "Nome ou apelido",
	profileNameHint: "Seu nome",
	profileHandle: "Nome de usuário",
	profileFree: " está disponível",
	profileUsed: " já está em uso",
	profileTaken: "Esse nome de usuário já está em uso. Tente outro.",
	profileLegalA: "Ao continuar, você aceita os ",
	profileTerms: "Termos",
	profileLegalB: " e a ",
	profilePrivacy: "Política de Privacidade",
	// 3a
	accTitle: "Agora somos parceiros!",
	accSub: "Você acaba de ganhar seu primeiro acessório.",
	accEquipped: " equipado",
	accCrown: "A coroa é só do líder da equipe ou de quem mais corre.",
	accCta: "Equipar e continuar",
	// 3b
	callTitle: "Me chame quando quiser",
	callSub: "Sem abrir o app. Do jeito que for mais rápido pra você.",
	callTap: "Toque duplo",
	callSiri: "Siri",
	callTapText: "Dê 2 toques atrás do celular e eu já abro a corrida.",
	callTapHint: "Ajustes › Acessibilidade › Toque › Toque Traseiro",
	callTapBubble: "Bora correr?",
	callSiriText: "Toque numa frase para testar",
	callListening: "Ouvindo…",
	callPhrases: [
		{ say: "E aí Siri, correr com o Buddy", reply: "Bora! Corrida com o Buddy iniciada." },
		{ say: "E aí Siri, Bud, correr com a equipe", reply: "Chamando a sua equipe…" },
	],
	callCta: "Entendi",
	// 3c
	careTitle: "Cuide de mim",
	careSub: "Eu tenho uma barra de vida. Se ficarmos 7 dias sem correr, eu fico doente.",
	careDays: "Dias sem correr",
	careRun: "Simular uma corrida",
	careSafe: "Uma corrida leve já recupera minha vida. Sem exageros: se sentir dor, descanse.",
	careMoods: ["Cheio de energia!", "Tô com saudade", "Tô fraquinho", "Fiquei doente…"],
	careMoodSubs: [
		"Correndo junto, eu fico forte.",
		"Bora correr? Faz uns dias…",
		"Uma corrida leve já me ajuda.",
		"Preciso de uma corrida pra sarar.",
	],
	// 04
	goalTitle: "O que você quer conquistar com o PACE?",
	goalBubble: "Me conta o seu objetivo!",
	goalCta: "CONTINUAR",
	// 05
	teamTitle: "Sua equipe começa com você.",
	teamSub: "Convide seus amigos, monte seu time e suba no ranking juntos.",
	teamCreate: "Criar minha equipe",
	teamCreateSub: "Você vira capitão e convida seus amigos.",
	teamJoin: "Entrar em uma equipe",
	teamJoinSub: "Com código, busca ou convite recebido.",
	teamSolo: "Quero correr sozinho por enquanto",
	teamCode: "Código da equipe",
	teamCodeCta: "Entrar com ",
	teamInvites: "Convites recebidos",
	teamAccept: "Aceitar",
	teamDecline: "Recusar",
	// 06
	invitesTitle: "Convide seus amigos para correr com você.",
	invitesCaptain: "Capitão: ",
	invitesCopyLink: "Copiar link",
	invitesWhats: "WhatsApp",
	invitesSearch: "Buscar por nome ou @usuário",
	invitesInvite: "Convidar",
	invitesMembers: "Integrantes",
	invitesSlots: " vagas",
	invitesSlot: "Vaga disponível",
	invitesStateCaptain: "Capitão",
	invitesStateIn: "Entrou",
	invitesStatePending: "Convite pendente",
	invitesNote: "Com o Team Pro, até 10 integrantes. Não precisa preencher todas as vagas.",
	invitesCta: "Concluir equipe",
	invitesLater: "Convidar depois",
	medalLabel: "PRIMEIRA MEDALHA",
	medalTitle: "Comprometimento",
	medalText: "Você montou sua equipe. Tô orgulhoso!",
	medalLevelA: "Nível 1",
	medalLevelB: "Nível 2 ↑",
	medalCta: "Continuar",
	// 07
	proBadge: "PACE TEAM PRO",
	proTitle: "Você lidera. Sua equipe evolui junto.",
	proSub: "Transforme sua equipe inteira em Premium.",
	proPrice: "R$ 39,90",
	proPer: "/mês",
	proUpTo: "Até 10 integrantes",
	proOne: "Uma assinatura",
	proCta: "TORNAR MINHA EQUIPE PRO",
	proSkip: "Continuar gratuitamente",
	proFoot: "Cancele quando quiser. O PACE TEAM continua grátis.",
	proBenefits: [
		{
			icon: "sparkles",
			title: "PACE AI",
			text: "Analisa suas corridas e ajuda cada um a evoluir.",
		},
		{
			icon: "palette",
			title: "PACE BUDDY STUDIO",
			text: "Acessórios e visuais exclusivos para o Buddy.",
		},
		{
			icon: "chart-column",
			title: "PACE TEAM ANALYTICS",
			text: "Relatórios avançados do desempenho coletivo.",
		},
	],
	// 08
	doneBadge: "Tudo pronto!",
	doneTitle: "Seu Buddy está pronto!",
	doneSub: "Agora é hora de começar sua jornada.",
	doneSolo: "Correndo solo",
	doneCta: "ENTRAR NO PACE TEAM",
} as const;

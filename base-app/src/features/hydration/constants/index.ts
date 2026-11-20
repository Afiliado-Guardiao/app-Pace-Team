export const HYDRO_COPY = {
	title: "PACE HYDRATION",
	todayLabel: "Hoje",
	of: (target: string) => `de cerca de ${target}`,
	remaining: (ml: string) => `Faltam ${ml} para a estimativa de hoje`,
	reached: "Você chegou na estimativa de hoje. Agora é beber conforme a sede.",
	restricted: "Você marcou uma orientação médica: o app não mostra meta, só o que você registrar.",
	estimateFrom: (base: string, runs: string) =>
		runs
			? `Base do dia ${base} + reposição das corridas ${runs}`
			: `Base do dia ${base} (sem corrida hoje)`,
	noWeight: "Informe seu peso para a estimativa ficar do seu tamanho.",
	addTitle: "Registrar água",
	other: "Outro",
	logTitle: "Registros de hoje",
	logEmpty: "Nenhum registro hoje ainda. Toque num copo acima.",
	remove: "Apagar registro",
	weekTitle: "Últimos 7 dias",
	runTitle: "Hidratação e corrida",
	before: "Antes",
	during: "Durante",
	after: "Depois",
	beforeText: (min: string, max: string) =>
		`Cerca de ${min} a ${max}, entre 2 e 4 horas antes de correr. Se a urina estiver bem clara, você está em dia.`,
	duringNone: "Corridas de até 45 min normalmente não pedem água no meio. Beba se sentir sede.",
	duringSips: "Leve água e beba goles pela sede, principalmente no calor.",
	duringPlan:
		"Corrida longa: planeje água no percurso e beba pela sede, sem passar do que você perde no suor.",
	afterNone: "Depois da próxima corrida, o PACE mostra aqui quanto repor.",
	afterText: (ml: string, loss: string) =>
		`Reponha cerca de ${ml} aos poucos nas próximas 2 a 4 horas (você perdeu por volta de ${loss} de suor).`,
	afterLog: "Registrar reposição",
	rateBy: (rate: string, personal: boolean) =>
		personal
			? `Pela sua pesagem: ${rate}/h de suor`
			: `Estimado pelo seu ritmo e pelo clima: ${rate}/h de suor`,
	sweatTitle: "Sua taxa de suor",
	sweatText:
		"Pese-se antes e depois de uma corrida (sem roupa molhada) e anote quanto bebeu. O PACE calcula quanto você sua por hora.",
	sweatNone: "Nenhuma pesagem ainda.",
	sweatAdd: "Fazer a pesagem",
	sweatItem: (rate: string, minutes: string) => `${rate}/h · corrida de ${minutes} min`,
	sweatInvalid: "Os números não fecham. Confira os pesos e a duração.",
	remindersTitle: "Lembretes",
	remindersOn: "Lembretes do Buddy",
	every: "A cada",
	window: (start: string, end: string) => `Das ${start} às ${end}`,
	startAt: "Começa às",
	endAt: "Termina às",
	pause: "Pausar hoje",
	resume: "Voltar a lembrar",
	paused: "Pausado até amanhã",
	postRun: "Aviso de reposição depois da corrida",
	quiet: "Nunca antes das 7h nem depois das 22h.",
	profileTitle: "Seus dados",
	weight: "Peso",
	height: "Altura",
	age: "Idade",
	notInformed: "não informado",
	editData: "Editar dados",
	restriction: "Tenho orientação médica sobre líquidos",
	restrictionNote: "Orientação (opcional)",
	restrictionHelp:
		"Com orientação médica (rins, coração, outras), siga sempre o que o seu médico indicou.",
	save: "Salvar",
	cancel: "Cancelar",
	amountTitle: "Quanto você bebeu?",
	amountLabel: "Mililitros",
	bodyTitle: "Seus dados",
	weightLabel: "Peso (kg)",
	heightLabel: "Altura (cm)",
	preKg: "Peso antes (kg)",
	postKg: "Peso depois (kg)",
	minutes: "Duração (min)",
	fluidMl: "Bebeu durante (ml)",
	disclaimer:
		"PACE HYDRATION faz acompanhamento e estimativas de hidratação, não diagnóstico nem tratamento. Não force beber além da sede. Em caso de dúvida, procure um profissional de saúde.",
	saved: "Registrado",
} as const;

// Copos rápidos (ml)
export const QUICK_ML = [150, 250, 350, 500] as const;
export const EVERY_OPTIONS = [
	{ value: "60", label: "1h" },
	{ value: "90", label: "1h30" },
	{ value: "120", label: "2h" },
	{ value: "180", label: "3h" },
] as const;
// Lembretes só entre 7h e 22h
export const HOURS = { min: 7, max: 22 } as const;

export const DAY_LETTERS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

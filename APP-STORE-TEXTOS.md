# PACE TEAM · textos da App Store

Textos prontos para colar no App Store Connect (pt-BR). Tudo aqui descreve só o
que o app já faz — a Apple recusa descrição que promete recurso que não existe.

## Nome e subtítulo

- **Nome** (até 30): `PACE TEAM`
- **Subtítulo** (até 30): `Corra em equipe e suba no rank`

## Texto promocional (até 170, muda sem nova versão)

Corra com a sua equipe, some pontos a cada km e dispute o ranking da sua cidade
toda semana. O Pace Buddy te chama para correr direto da tela inicial.

## Descrição (até 4.000)

```
PACE TEAM é o app de corrida para quem corre melhor junto. Cada quilômetro que você corre soma pontos para a sua equipe, e toda semana as equipes da sua cidade disputam o ranking.

CORRA E PONTUE
• Corrida com GPS, inclusive com a tela bloqueada: distância, tempo, ritmo e percurso.
• 8 pontos por km (até 20 km por corrida), com verificação automática para manter a disputa justa.
• Modos livre, por distância, por tempo e "correr junto" com quem do time está online.

EQUIPES E RANKING
• Crie sua equipe (3, 5 ou 10 atletas) ou entre com um código de convite.
• Ranking semanal por cidade, região, estado e país.
• Modo Virada: acompanhe a disputa com a equipe logo à frente e saiba quantos pontos faltam para ultrapassar.

DESAFIOS E MEDALHAS
• Desafios da semana e do mês (40 km na semana, 5 treinos, recorde de 5 km) e metas coletivas do time.
• Medalhas e conquistas da equipe liberadas pelas suas corridas.

FEED E STORIES
• Poste a foto da corrida com a arte do PACE TEAM e veja as corridas da comunidade.
• Gere o story da corrida para compartilhar no Instagram.

PACE BUDDY
• O mascote do PACE TEAM fora do app: widget na tela inicial, atalho com dois toques atrás do iPhone (Toque Traseiro), corrida na Dynamic Island e despertador de corrida.

ASSINATURA PACE TEAM
• Mensal: R$ 12,90 por mês. Anual: R$ 89,90 por ano.
• A assinatura libera todos os recursos do app.
• A cobrança é feita na sua conta Apple na confirmação da compra. A assinatura renova automaticamente, a menos que seja cancelada pelo menos 24 horas antes do fim do período; a renovação é cobrada nas 24 horas anteriores. Gerencie ou cancele em Ajustes › [seu nome] › Assinaturas.

Termos de Uso: https://afiliado-guardiao.github.io/app-Pace-Team/termos.html
Política de Privacidade: https://afiliado-guardiao.github.io/app-Pace-Team/privacidade.html

Correr envolve esforço físico: consulte um médico antes de começar ou intensificar seus treinos.
```

> Se a assinatura tiver período de teste grátis, acrescente na seção ASSINATURA:
> "Teste grátis de X dias; depois dele a assinatura é cobrada, salvo cancelamento
> antes do fim do teste."

## Palavras-chave (até 100, separadas por vírgula, sem espaço)

`corrida,correr,equipe,ranking,running,km,gps,treino,desafio,corredor,maratona,pace,time,medalha`

## URLs

- Suporte: https://afiliado-guardiao.github.io/app-Pace-Team/
- Política de Privacidade: https://afiliado-guardiao.github.io/app-Pace-Team/privacidade.html
- Termos de Uso (EULA personalizada ou na descrição): https://afiliado-guardiao.github.io/app-Pace-Team/termos.html

## Assinaturas (App Store Connect › Assinaturas)

- Grupo: `PACE TEAM`
- Produto 1: `paceteam_mensal` · 1 mês · R$ 12,90 · nome exibido "PACE TEAM Mensal"
- Produto 2: `paceteam_anual` · 1 ano · R$ 89,90 · nome exibido "PACE TEAM Anual"
  (equivale a R$ 7,49/mês — 42% a menos que 12 meses no mensal)
- Os dois produtos liberam tudo (sem diferença de recursos).
- Inscreva-se no **App Store Small Business Program** (taxa de 15% em vez de 30%).

## Tela de assinatura (paywall) — PRONTA no app

`src/features/paywall` (visual PACE TEAM, compra pelo RevenueCat) já mostra,
antes do botão de compra:
- os dois planos com preço e período vindos da Apple (R$ 12,90/mês e
  R$ 89,90/ano, com o "Economize 42%" calculado);
- o aviso de renovação automática e como cancelar (e o do teste grátis, se
  houver);
- links para os **Termos de Uso** e a **Política de Privacidade**;
- **Restaurar compras**, **Sair da conta** e **Excluir conta**.

No Perfil › Configurações: **Gerenciar assinatura** e **Restaurar compras**.
Configuração das contas: `REVENUECAT-PASSO-A-PASSO.md`.

## Notas para a revisão da Apple (App Review Information)

```
Conta de teste: [e-mail] / [senha]  (já em uma equipe, com corridas e posts)

• Localização em segundo plano: usada apenas durante uma corrida iniciada pelo usuário, para medir distância e percurso com a tela bloqueada. O indicador azul do iOS aparece enquanto a corrida está ativa.
• Pace Buddy: o atalho "Chamar Pace Buddy" fica no app Atalhos e pode ser ligado em Ajustes › Acessibilidade › Toque › Tocar Atrás. Há também um widget e uma Live Activity durante a corrida.
• Conteúdo dos usuários (feed): cada post tem o menu "···" para denunciar o post ou bloquear o atleta. Posts com 3 denúncias saem do feed até a revisão; revisamos denúncias em até 24 horas.
• Exclusão de conta: Perfil › Configurações › Excluir conta.
• Assinatura: compras de teste pela sandbox da Apple.
```

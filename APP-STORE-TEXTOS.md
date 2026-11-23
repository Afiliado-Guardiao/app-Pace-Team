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
• Corra sozinho ou junto com quem da equipe está online, vendo os colegas no mapa.
• Corridas do relógio (Apple Watch e outros que salvam no app Saúde) entram no seu histórico, se você permitir.

EQUIPES E RANKING
• Crie sua equipe ou entre com um código de convite.
• Ranking semanal por cidade, região, estado e país.
• Modo Virada: veja quantos pontos faltam para passar a equipe logo à frente.
• Roleta da equipe: sorteie um desafio de corrida para o time (sem dinheiro e sem apostas: vale só pontos no app).

DESAFIOS E MEDALHAS
• Desafios da semana e do mês e metas coletivas do time.
• Medalhas e conquistas liberadas pelas suas corridas.

FEED E STORIES
• Poste a foto da corrida com a arte do PACE TEAM e veja as corridas da comunidade.
• Gere o story da corrida para compartilhar.

PACE BUDDY
• O mascote do PACE TEAM fora do app: widget na tela inicial, atalho com dois toques atrás do iPhone (Toque Traseiro), corrida na Dynamic Island e despertador de corrida.

TEAM PRO (OPCIONAL)
O app de corrida, o ranking e o feed são grátis. O Team Pro é uma assinatura que libera, para você e mais 9 da sua equipe (10 no total):
• PACE AI: o Buddy responde perguntas sobre as suas corridas, por texto ou voz.
• Buddy Studio: cores, acessórios e efeitos para o Buddy.
• Team Analytics: relatórios do desempenho da equipe.
• PACE HYDRATION: meta de água do dia ajustada ao clima e às corridas.
O Team Pro não dá pontos, km nem posição no ranking.

Planos mensal e anual. A cobrança é feita na sua conta Apple na confirmação da compra. A assinatura renova automaticamente pelo mesmo valor, a menos que seja cancelada pelo menos 24 horas antes do fim do período; a renovação é cobrada nas 24 horas anteriores ao fim do período. Gerencie ou cancele em Ajustes › [seu nome] › Assinaturas.

Termos de Uso: https://afiliado-guardiao.github.io/app-Pace-Team/termos.html
Política de Privacidade: https://afiliado-guardiao.github.io/app-Pace-Team/privacidade.html

O PACE TEAM não é um app médico. Correr envolve esforço físico: consulte um médico antes de começar ou intensificar seus treinos.
```

> Não escreva preço na descrição: a Apple mostra o preço de cada plano na
> própria página do app, e um preço escrito que não bate com a loja é motivo de
> recusa. Se algum plano tiver teste grátis, acrescente em TEAM PRO: "Teste
> grátis de X dias; depois dele a assinatura é cobrada, salvo cancelamento
> antes do fim do teste."

## Palavras-chave (até 100, separadas por vírgula, sem espaço)

`corrida,correr,equipe,ranking,running,km,gps,treino,desafio,corredor,maratona,pace,time,medalha`

## URLs

- Suporte: https://afiliado-guardiao.github.io/app-Pace-Team/
- Política de Privacidade: https://afiliado-guardiao.github.io/app-Pace-Team/privacidade.html
- Termos de Uso (EULA personalizada ou na descrição): https://afiliado-guardiao.github.io/app-Pace-Team/termos.html

## Assinaturas (App Store Connect › Assinaturas)

- Grupo: `PACE TEAM`, com o plano mensal e o anual do **Team Pro** (os dois
  liberam o mesmo; o anual sai mais barato por mês).
- Em cada produto, o **nome exibido** e a **descrição** precisam falar de Team
  Pro e do que ele libera (PACE AI, Buddy Studio, Team Analytics e PACE
  HYDRATION para até 10 integrantes). Texto sugerido para a descrição (até 55
  caracteres): `Recursos Pro para até 10 da sua equipe`.
- O preço que aparece no app vem sempre da Apple (o app não tem preço escrito à
  mão).
- Inscreva-se no **App Store Small Business Program** (taxa de 15% em vez de 30%).

## Tela de assinatura (tela PRO) — PRONTA no app

`src/features/pro` (compra pelo RevenueCat) mostra, antes do botão de compra:
- os dois planos com preço e período vindos da Apple (e o "Economize X%"
  calculado);
- o aviso de renovação automática e como cancelar (e o do teste grátis, se
  houver);
- links para os **Termos de Uso** e a **Política de Privacidade**;
- **Restaurar compras**.

No Perfil › Configurações: **Gerenciar assinatura**, **Restaurar compras** e
**Excluir conta**. Configuração das contas: `REVENUECAT-PASSO-A-PASSO.md`.

## Notas para a revisão da Apple (App Review Information)

```
Demo account: [e-mail] / [password] (already in a team with Team Pro, runs and posts)

• The core app (running, teams, ranking, feed) is free. "Team Pro" is an optional auto-renewable subscription bought in-app with Apple IAP (RevenueCat). Any user can subscribe from the Team Pro sheet (shown when a free user tries a Pro feature, which can be previewed but not used). It unlocks PACE AI, Buddy Studio, Team Analytics and PACE Hydration for the subscriber and up to 10 members of their team. It gives no points or ranking advantage.
• Background location: used only during a run the user starts, to measure distance and route with the screen locked. The iOS blue indicator is shown while the run is active. "Always" is only requested if the user turns on the Back Tap shortcut to start a run.
• HealthKit: read-only. Imports the user's running workouts (distance, time, route, average heart rate) from watches into the run history. Never written, never used for advertising.
• PACE AI: uses Anthropic's Claude. Before the first use, the app shows a consent screen explaining what is sent (question, run summary, first name, team km) and to whom. Nothing is sent without "Concordo". Voice is transcribed on-device.
• Team roulette ("Roleta da equipe"): a random running challenge for the team. No money, no purchases, no prizes outside the app: only in-app points.
• User content (feed): each post has the "···" menu to report the post or block the athlete. Posts with 3 reports leave the feed until review; reports are reviewed within 24 hours. Contact: clicae@outlook.com.
• Account deletion: Perfil › Configurações › Excluir conta.
• Subscription: test purchases with an Apple sandbox account.
```

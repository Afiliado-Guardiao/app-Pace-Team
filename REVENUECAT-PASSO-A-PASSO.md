# RevenueCat · passo a passo do PACE TEAM

O código da assinatura já está pronto no app: tela de assinatura no visual
PACE TEAM, "Restaurar compras", "Gerenciar assinatura" no Perfil e a ligação
com o Supabase. Falta configurar as contas. Siga na ordem; cada parte diz o
que me mandar no final.

Nomes usados (copie exatamente):

| O quê | Valor |
|---|---|
| Bundle ID do app | `com.paceteam.app` |
| Plano mensal (ID do produto) | `paceteam_mensal` — R$ 12,90 por mês |
| Plano anual (ID do produto) | `paceteam_anual` — R$ 89,90 por ano |
| Grupo de assinaturas | `PACE TEAM` |
| Entitlement no RevenueCat | `premium` |
| Oferta no RevenueCat | `default` |

---

## Parte 1 · App Store Connect (appstoreconnect.apple.com)

1. **Contratos e banco** — menu *Business* (ou *Contratos, Impostos e Banco*):
   aceite o contrato **Paid Apps**, preencha a **conta bancária** e os
   **impostos**. Sem isso a Apple não deixa vender nem testar compras.
2. **Small Business Program** — em developer.apple.com/app-store/small-business-program
   faça a inscrição (taxa de 15% em vez de 30%).
3. **Crie o app** (se ainda não criou): *Apps* › "+" › *Novo app* › iOS, nome
   `PACE TEAM`, idioma Português (Brasil), Bundle ID `com.paceteam.app`, SKU
   `paceteam-ios`.
4. **Crie as assinaturas** — dentro do app › *Monetização* › *Assinaturas* ›
   crie o grupo `PACE TEAM` e, dentro dele, duas assinaturas:
   - Nome de referência `Mensal`, ID do produto `paceteam_mensal`, duração
     **1 mês**, preço: escolha o Brasil e **R$ 12,90** (a Apple calcula os
     outros países).
   - Nome de referência `Anual`, ID do produto `paceteam_anual`, duração
     **1 ano**, preço **R$ 89,90**.
   - Em cada uma, em *Localização* (Português): nome de exibição
     `PACE TEAM Mensal` / `PACE TEAM Anual` e descrição
     `Acesso completo ao PACE TEAM`.
   - (Opcional) *Teste grátis*: em cada assinatura › *Oferta introdutória* ›
     gratuita por X dias. O app já mostra "Começar teste grátis" sozinho.
5. **Chave de compras para o RevenueCat** — *Usuários e acesso* ›
   *Integrações* › *Compra dentro do app* (In-App Purchase) › "+" › gere a
   chave. **Baixe o arquivo .p8** (só dá para baixar uma vez) e anote o
   **Key ID** e o **Issuer ID** que aparecem na página.
6. **Testador sandbox** — *Usuários e acesso* › *Sandbox* › *Testadores* › "+".
   Use um e-mail que **não** seja da sua conta Apple real. No iPhone:
   *Ajustes* › *App Store* › *Conta Sandbox* › entre com esse testador.

## Parte 2 · RevenueCat (app.revenuecat.com)

1. Crie a conta grátis e um **projeto** chamado `PACE TEAM`.
2. **Adicione o app**: *Apps & providers* › *Add app* › **App Store** ›
   nome `PACE TEAM`, Bundle ID `com.paceteam.app`.
3. Na configuração desse app, em **In-app purchase key**: envie o arquivo
   **.p8** da Parte 1, preencha o **Key ID** e o **Issuer ID** e salve.
4. **Produtos**: *Product catalog* › *Products* › *New* (ou *Import*) › crie
   `paceteam_mensal` e `paceteam_anual` ligados ao app da App Store.
5. **Entitlement**: *Product catalog* › *Entitlements* › *New* › identificador
   `premium` › *Attach* os **dois** produtos.
6. **Oferta**: *Product catalog* › *Offerings* › *New* › identificador
   `default` › marque como **Current** › adicione dois pacotes:
   - *Monthly* (`$rc_monthly`) com `paceteam_mensal`
   - *Annual* (`$rc_annual`) com `paceteam_anual`
7. **Chave pública do app**: *Project settings* › *API keys* › copie a chave
   **pública** do app iOS (começa com `appl_`). → **Me mande essa chave.**
   (A chave secreta, que começa com `sk_`, **não** vai para o app — não me
   mande essa.)
8. **Webhook** (avisa o Supabase de cada compra, renovação e cancelamento):
   *Integrations* › *Webhooks* › *Add new configuration*:
   - Nome: `Supabase`
   - URL: `https://vtupfqsguvrioxeyyyeg.supabase.co/functions/v1/revenuecat-webhook`
   - **Authorization header value**: a senha que te passei na conversa
     (começa com `rcwh_`)
   - Ambiente: **Both / Production and Sandbox**
   - Salve e clique em **Send test event** (deve dar sucesso depois da Parte 3).

## Parte 3 · Supabase (supabase.com › projeto `base-app`)

1. *Edge Functions* › *Secrets* (ou *Project Settings* › *Edge Functions*) ›
   *Add new secret*:
   - Nome: `REVENUECAT_WEBHOOK_AUTH`
   - Valor: a **mesma** senha `rcwh_…` do webhook
2. Volte ao RevenueCat e mande o **evento de teste** de novo: tem que aparecer
   "200 OK".

## Parte 4 · O que eu faço quando você me mandar a chave `appl_…`

- Coloco a chave no `eas.json` (builds de teste e da loja).
- A partir daí, no iPhone, quem não tiver assinatura vê a tela de assinatura
  ao entrar; quem assinar entra direto. Sem a chave o app continua abrindo
  liberado, então nada quebra enquanto você configura.
- Testamos juntos com o testador sandbox: assinar, cancelar, restaurar e o
  aviso chegando no Supabase.

## Problemas comuns

- **A tela de assinatura aparece sem planos**: o contrato Paid Apps ainda não
  foi aceito, os produtos estão "Faltando metadados" na Apple, ou a oferta
  `default` não está marcada como *Current* no RevenueCat. Pode levar algumas
  horas depois de criar os produtos.
- **Compra de teste pede a senha real**: entre com o testador sandbox em
  *Ajustes* › *App Store* › *Conta Sandbox*.
- **Na revisão da Apple**: cada assinatura precisa de uma captura de tela da
  tela de assinatura (*Review information*) e ser enviada junto com a
  primeira versão do app.

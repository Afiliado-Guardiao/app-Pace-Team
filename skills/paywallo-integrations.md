# Skill: Paywallo SDK — Integrações Externas (Dashboard-Only)

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.2.x
> **Onde acontece a configuração:** dashboard do Paywallo (`https://paywallo.com.br/dashboard`).
> **Não exige código no app:** estas integrações operam server-side. O SDK já dispara `paywallo_install` e `Purchase`; o servidor da Paywallo encaminha para Meta/TikTok via CAPI/Events API, e recebe webhooks do Superwall.

Esta skill consolida as integrações **publicadas** na [doc oficial](https://paywallo.com.br/docs):

- [Meta Ads (CAPI)](https://paywallo.com.br/docs/meta-ads)
- [TikTok Ads (Events API)](https://paywallo.com.br/docs/tiktok-ads)
- [Superwall (importação de eventos)](https://paywallo.com.br/docs/superwall)
- [Conectar lojas (App Store / Google Play)](https://paywallo.com.br/docs/conectar-lojas) — _doc em construção_
- [Tracking links e atribuição](https://paywallo.com.br/docs/tracking-links-atribuicao) — _doc em construção_

---

## 1. Meta Ads (Facebook CAPI)

Envia conversões server-side para Meta — sem precisar de pixel client-side ou SDK do Facebook no app.

### Credenciais necessárias

| Campo                        | Onde pegar                                                                                                                                            |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dataset ID** (Pixel ID)    | Meta Events Manager → Data Sources → seu pixel → ID numérico abaixo do nome                                                                           |
| **Ad Account ID**            | Ads Manager → canto superior esquerdo (`act_XXXXXXXXX`) ou Business Settings → Ad Accounts                                                            |
| **Access Token (System User)** | Business Manager → Settings → System Users → cria System User com role **Admin** → gera token com permissões `ads_management`, `ads_read`, `business_management`. **Meta mostra o token apenas uma vez** — salve antes de fechar |

### Configuração no dashboard

1. Dashboard Paywallo → seu app → **Integrations** → **Meta Ads**
2. Cole `Dataset ID`, `Ad Account ID`, `Access Token`
3. Salvar

### Eventos enviados automaticamente

| Evento Meta         | Quando dispara                                                            | Observação                                                                              |
| :------------------ | :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| `paywallo_install`  | Quando um install é atribuído a um clique em tracking link                | **Custom event** — você precisa aceitar manualmente em Events Manager antes de Meta processar |
| `Purchase`          | Compra validada via SDK (StoreKit 2 / Google Play Billing)                | Standard event — inclui `value` e `currency`, reconhecido automaticamente por Meta      |

> **Não é preciso instalar `react-native-fbsdk-next`** nem similares. O envio é server-side via CAPI.

### Checklist Meta Ads

- [ ] System User criado com Admin role
- [ ] Access Token salvo em local seguro (Meta só mostra 1x)
- [ ] Dataset ID, Ad Account ID e Access Token colados no dashboard
- [ ] Custom event `paywallo_install` aceito em Events Manager (primeira vez que aparece)
- [ ] Campanha de conversão configurada para otimizar por `Purchase` ou `paywallo_install`

---

## 2. TikTok Ads (Events API)

Envia conversões server-side para TikTok — sem TikTok Pixel client-side.

### Credenciais necessárias

| Campo            | Onde pegar                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Pixel Code**   | [`ads.tiktok.com`](https://ads.tiktok.com) → Assets → Events → Web Events → seu pixel → ID exibido (formato `D7JQHIRC77UANP8N4GA0`) |
| **Access Token** | Em Events → seu pixel → Settings → opção de gerar token de longa duração                                                         |
| **App ID** (opcional) | Identificador numérico do app em TikTok for Business                                                                        |

### Configuração no dashboard

1. Dashboard Paywallo → seu app → **Integrations** → **TikTok Ads**
2. Cole `Pixel Code` e `Access Token` (App ID opcional)
3. Salvar

### Eventos enviados automaticamente

| Evento TikTok       | Quando dispara                                              | Observação                                       |
| :------------------ | :---------------------------------------------------------- | :----------------------------------------------- |
| `paywallo_install`  | Install atribuído a clique em tracking link                 | Custom event — aparece em TikTok após primeiro envio |
| `Purchase`          | Compra validada via SDK                                      | Standard event — inclui `value` e `currency`     |

### Checklist TikTok Ads

- [ ] Pixel Code copiado de `ads.tiktok.com`
- [ ] Access Token gerado em Settings do pixel
- [ ] Credenciais coladas no dashboard Paywallo
- [ ] Campanha configurada para otimizar por `paywallo_install` ou `Purchase`

---

## 3. Superwall (importação de eventos)

Importa eventos de paywall e subscription do Superwall para o Paywallo — útil em migrações graduais ou setups híbridos.

### Setup

1. **Pegar credenciais no Paywallo**
   - Dashboard → Settings → Integrations → **Superwall** → copiar `webhook URL` e `secret`
   - URL no formato: `https://paywallo.com.br/api/webhook/superwall/{your-app-key}`

2. **Configurar webhook no Superwall**
   - Superwall → Settings → Webhooks → Add endpoint
   - URL: a copiada do Paywallo
   - **Header custom obrigatório:** `x-paywallo-secret` com o valor do `secret`
   - Sem header ou valor incorreto → 401

3. **Selecionar eventos a enviar** (todos os 7 abaixo):
   - `initial_purchase`
   - `renewal`
   - `cancellation`
   - `uncancellation`
   - `expiration`
   - `billing_issue`
   - `non_renewing_purchase`

4. **Salvar.** Eventos aparecem em tempo real no dashboard Paywallo.

### Quando usar

- ✅ Migração gradual de Superwall → Paywallo (mantém histórico)
- ✅ Manter Superwall para paywalls UI + Paywallo para atribuição/analytics
- ❌ App novo começando do zero — use o SDK Paywallo direto

### Checklist Superwall

- [ ] Webhook URL e secret copiados do dashboard Paywallo
- [ ] Endpoint criado no Superwall com header `x-paywallo-secret` correto
- [ ] Os 7 eventos selecionados
- [ ] Primeiro evento de teste recebido (sandbox)

---

## 4. Conectar lojas (App Store Connect / Google Play)

> ⚠️ A [doc oficial](https://paywallo.com.br/docs/conectar-lojas) marca esta página como "em construção". As notas abaixo são o que o SDK assume — confirmar no dashboard antes de configurar.

Para que o Paywallo valide recibos e receba notificações server-to-server das lojas:

### Apple App Store

- **App Store Connect → Users and Access → Keys (In-App Purchase)** → cria chave com permissão de IAP
- **App-Specific Shared Secret** → App Store Connect → seu app → Subscriptions → Shared Secret
- **App Store Server Notifications V2** → URL fornecida pelo dashboard Paywallo
- Cole tudo no dashboard Paywallo → Integrations → App Store

### Google Play

- **Google Cloud Console** → cria Service Account → baixa JSON
- **Play Console** → Setup → API Access → vincula Service Account → dá permissão "View financial data, orders, and cancellation survey responses" + "Manage orders and subscriptions"
- **Real-Time Developer Notifications (RTDN)** → URL fornecida pelo dashboard Paywallo
- Cole o JSON do Service Account no dashboard Paywallo → Integrations → Google Play

---

## 5. Tracking links e atribuição

> ⚠️ A [doc oficial](https://paywallo.com.br/docs/tracking-links-atribuicao) marca esta página como "em construção".

Tracking links convertem cliques em campanhas (Meta, TikTok, Google Ads) em **installs atribuídos**. O fluxo geral:

1. Dashboard Paywallo → **Tracking Links** → cria link por campanha
2. Cole o link gerado como destino da campanha de Ads (Meta, TikTok, Google)
3. Quando o user clica → Paywallo registra o clique + parâmetros UTM/click_id
4. Quando o app é instalado e o SDK inicia → atribuição automática pelo `distinctId`
5. Conversão (compra) é correlacionada à campanha original

### Code touch point

O SDK trata atribuição automaticamente. **Você não precisa chamar `handleDeepLink` manualmente** — a `PaywalloClient.init()` já lê IDFA (se permitido via ATT) e o referrer Install Referrer (Play).

Se for usar Universal Links (iOS) / App Links (Android) para deep linking custom, plugue normalmente — o Paywallo não interfere.

### Conectar com Meta/TikTok

A integração tracking link → conversion event é **automática** quando você configura:
- Meta Ads ou TikTok Ads no dashboard (seções 1 e 2 desta skill)
- Tracking link com a campanha correspondente
- `paywallo_install` e `Purchase` são enviados server-side

---

## 6. Variáveis de ambiente

**Nenhuma variável de env é necessária no `base-app`** para essas integrações. Todas as credenciais ficam no dashboard do Paywallo, server-side.

A única variável continua sendo a `EXPO_PUBLIC_PAYWALLO_APP_KEY` — o `appKey` que o SDK usa para se identificar contra o servidor.

---

## 7. Verificando

| Integração   | Como confirmar que está funcionando                                                                                                                                              |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta Ads     | Meta Events Manager → Test Events → simula um install via tracking link em ambiente sandbox → `paywallo_install` aparece em 5-10 min                                              |
| TikTok Ads   | TikTok Ads Manager → Events → Test Events → mesmo fluxo                                                                                                                          |
| Superwall    | Dashboard Paywallo → Events feed → eventos importados aparecem com tag `source: superwall`                                                                                       |
| App Store    | Compra de teste em Sandbox → dashboard mostra subscription em **Users** com status `active`. Cancelar pelo Settings → status muda para `cancelled` em até 1 min via ASSN V2     |
| Google Play  | Compra de teste com License Tester → dashboard mostra subscription. RTDN aparece em até 30s                                                                                       |
| Tracking link| Clique no link em device limpo → install do app → `paywallo_install` aparece no dashboard com `attribution_source: <campaign>`                                                  |

---

## 8. Anti-patterns

| ❌ Não faça                                                              | ✅ Faça                                                                          |
| :---------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| Instalar `react-native-fbsdk-next` para enviar conversões para Meta     | Configurar Meta Ads no dashboard — Paywallo envia server-side via CAPI           |
| Instalar `@tiktokshop/tiktok-events-sdk` ou similar                     | Configurar TikTok Ads no dashboard — Paywallo envia via Events API server-side   |
| Migrar abruptamente Superwall → Paywallo perdendo histórico             | Configure o webhook Superwall → Paywallo, mantenha ambos durante a transição    |
| Colocar credenciais Meta/TikTok/Apple/Google em `.env` do app           | Tudo fica no dashboard Paywallo, server-side                                     |
| Implementar atribuição custom com AppsFlyer/Adjust em paralelo          | Tracking links + atribuição nativa do Paywallo cobrem o caso padrão              |

---

## 9. Próximos passos

- Master guide: [`paywallo-full-skill.md`](./paywallo-full-skill.md)
- Setup técnico no app: [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md)
- A/B testing: [`paywall-ab-testing.md`](./paywall-ab-testing.md)

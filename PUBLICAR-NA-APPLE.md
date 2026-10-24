# PACE TEAM · como publicar na App Store

Guia da fase 4 (preparar o envio). O que já está pronto no código fica na
primeira parte; o resto depende de contas e painéis que só você acessa.

## 1. Já pronto no projeto

- **Ícone** `base-app/assets/brand/app-icon-1024.png`: 1024 × 1024, quadrado
  cheio e sem transparência (a Apple arredonda os cantos sozinha). Mesmas
  cores e mesmo desenho do ícone do design, com bordas nítidas.
- **`app.json`**:
  - `ios.config.usesNonExemptEncryption: false` — o app só usa HTTPS, então
    o App Store Connect não pergunta sobre criptografia a cada envio.
  - Manifesto de privacidade do app e do widget (uso do UserDefaults do App
    Group, motivos `CA92.1` e `1C8F.1`).
  - Textos de permissão em português: localização (durante a corrida e com a
    tela bloqueada), câmera, fotos e despertador.
- **`expo-doctor`**: 18 de 18 verificações passando.
- **Exclusão de conta dentro do app** (exigência da Apple): Perfil ›
  Configurações › Excluir conta.

## 2. O que só você pode fazer

### Apple Developer (developer.apple.com)
1. Copie o **Team ID** (Account › Membership details) e me passe: ele entra
   em `ios.appleTeamId` no `app.json` (o widget precisa dele para compilar).
2. No **App Store Connect** › Apps › "+": crie o app com o bundle
   `com.paceteam.app`, nome **PACE TEAM** e um SKU (ex.: `paceteam-ios`).

### Expo / EAS (no terminal, dentro de `base-app`)
```bash
npx eas login
npx eas init
```
O `eas init` grava o `projectId` no `app.json` — sem ele as notificações push
não funcionam.

Cadastre as chaves do Supabase para o build na nuvem (o `.env` do seu
computador não vai para lá):
```bash
npx eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value "https://vtupfqsguvrioxeyyyeg.supabase.co" --visibility plaintext
npx eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<a mesma chave do .env>" --visibility plaintext
```
Repita com `--environment preview` para os builds de teste.

Build e envio (o EAS cria certificados, App Group, Push e "Sign in with Apple"
na sua conta Apple quando pedir login):
```bash
npx eas build -p ios --profile production
npx eas submit -p ios
```

### Supabase (supabase.com › projeto `base-app`)
1. **Plano**: o projeto está no plano gratuito, que **pausa depois de 7 dias
   sem uso**. Para usuários reais, mude para o Pro (Settings › Billing).
2. **Login com Apple** (Authentication › Sign In / Providers › Apple): ligue e
   em *Client IDs* coloque `com.paceteam.app`. Para o login nativo do iPhone
   não precisa de chave secreta.
3. **E-mail (SMTP)** (Authentication › Emails › SMTP Settings): o e-mail
   padrão do Supabase manda poucos e-mails por hora e cai em spam. Configure
   um serviço (Resend, Brevo, Amazon SES…) antes de lançar — é ele que envia o
   "Esqueci minha senha".
4. **Confirmação de e-mail**: hoje está **desligada**, e o cadastro conta com
   isso (o usuário anônimo do onboarding vira conta na hora). **Não ligue**
   antes de o app ganhar a tela "confirme seu e-mail".
5. **Senhas vazadas** (Authentication › Policies): a proteção contra senhas
   vazadas só existe no plano Pro — ligue depois de mudar de plano.

### App Store Connect (página do app)
- **Política de Privacidade (URL obrigatória)** e Termos de Uso. Hoje os
  textos no cadastro não abrem nada.
- **Privacidade do app** (questionário): localização precisa (corridas),
  fotos, nome, e-mail, ID do usuário, conteúdo do usuário (posts) e
  identificadores de push. Se o Paywallo/Superwall forem ligados, declarar
  também dados de uso e compras.
- **Capturas de tela** do iPhone 6,9" (obrigatórias), descrição, palavras-
  chave, URL de suporte, classificação etária.
- **Conta de teste para a revisão** (e-mail e senha) já com equipe e corridas.
- **Nota para a revisão**: explique o GPS em segundo plano ("mede a corrida
  com a tela bloqueada; só enquanto uma corrida está em andamento") e o
  atalho de Toque Traseiro do Pace Buddy.

## 3. Pendências no app antes de enviar

- **"Esqueci minha senha" incompleto**: o e-mail é enviado, mas o link não
  volta para o app e não existe tela para criar a senha nova.
- **Termos e Política de Privacidade**: escrever, publicar numa URL e deixar
  os textos do cadastro clicáveis.
- **Assinatura (Paywallo/Superwall)**: as chaves estão vazias. Decidir se o
  app terá assinatura no lançamento; se não, dá para tirar esses SDKs.
- **Ícone do Android**: ainda usa a arte antiga com cantos arredondados (só
  importa se for publicar no Android).
- **Teste no iPhone de verdade** (build `preview` ou TestFlight): GPS na rua,
  câmera e galeria, widget, Dynamic Island, Toque Traseiro, notificações e
  despertador.

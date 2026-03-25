# LapidaAI — Analisador de Currículo com Inteligência Artificial

LapidaAI é um analisador de currículo inteligente. Você pode fazer o upload do seu currículo em PDF ou colar o texto, anexar os detalhes de uma vaga e obter uma análise detalhada usando Inteligência Artificial. A análise retorna um score geral, métricas sobre como seu currículo se comporta num ATS, aderência à vaga, clareza, e te dá sugestões práticas.

## Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS, shadcn/ui.
- **Gráficos**: Recharts.
- **Gerenciamento de Estado**: Zustand.
- **Backend**: Next API Routes.
- **Integração de IA**: Google Gemini (`gemini-2.5-flash`) — configurável via `AI_PROVIDER`.
- **Pagamentos**: Stripe Checkout (pagamento único para acesso Premium).
- **Processamento de Arquivos**: `pdf-parse` para extração de dados do PDF na API route.

## Como começar

### Pré-requisitos
- Node.js >= 18.x
- NPM / Yarn / PNPM

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL>
   cd analisador-de-curriculo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   Preencha as variáveis no `.env.local`:
   - `GEMINI_API_KEY` — chave da API do Google Gemini
   - `AI_PROVIDER` — `google` (ou `openai`)
   - `STRIPE_SECRET_KEY` — chave secreta do Stripe
   - `STRIPE_PRICE_ID` — ID do preço do produto no Stripe
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — chave pública do Stripe
   - `NEXT_PUBLIC_BASE_URL` — URL base do site

4. Execute o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Funcionalidades

- Upload de PDF para leitura de currículos.
- Análise com IA (comparativa com vaga ou análise geral).
- Gráfico de Radar de qualidade do currículo e fit com a vaga.
- Exibição de habilidades esperadas vs. encontradas com crachás visuais.
- Plano de Ação Premium com recomendações detalhadas.
- Pagamento único via Stripe Checkout para desbloquear o Premium.
- Limite de 1 análise gratuita por sessão.

## Deploy na Vercel

1. Faça push do projeto para um repositório GitHub.
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Em **Environment Variables**, adicione todas as variáveis do `.env.example` com os valores de produção:
   - Use chaves **LIVE** do Stripe (`sk_live_`, `pk_live_`) em produção.
   - Defina `NEXT_PUBLIC_BASE_URL` com o domínio final (ex: `https://lapidaai.vercel.app`).
4. Clique em **Deploy**.
5. Após o deploy, copie a URL gerada e atualize `NEXT_PUBLIC_BASE_URL` nas variáveis de ambiente da Vercel, depois faça um **Redeploy**.

## Configuração do Stripe

1. Acesse [dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
2. Clique em **Add product**
3. Nome: "LapidaAI Premium", Preço: R$ 9,90 (BRL), one-time
4. Copie o `Price ID` (`price_xxx`) e coloque no `.env.local`
5. Cartão de teste: `4242 4242 4242 4242` | qualquer validade futura | qualquer CVC

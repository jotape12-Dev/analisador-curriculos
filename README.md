# ResumeAI — Analisador de Currículo com Inteligência Artificial

ResumeAI é um analisador de currículo inteligente. Você pode fazer o upload do seu currículo em PDF ou colar o texto, anexar os detalhes de uma vaga e obter uma análise detalhada usando Inteligência Artificial. A análise retorna um score geral, métricas sobre como seu currículo se comporta num ATS, aderência à vaga, clareza, e te dá sugestões práticas.

## Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS, shadcn/ui.
- **Gráficos**: Recharts.
- **Gerenciamento de Estado**: Zustand.
- **Backend**: Next API Routes.
- **Integração de IA**: Suporte a OpenAI (`gpt-4o`) e Anthropic (`claude-3.5-sonnet`) dependendo da variável `AI_PROVIDER`.
- **Processamento de Arquivos**: `pdf-parse` para extração de dados do PDF na API route.

## Como começar

### Pré-requisitos
- Node.js >= 18.x
- NPM / Yarn / PNPM

### Instalação

1. Clone o repositório ou faça o download:
   ```bash
   git clone <URL>
   cd analisador-de-curriculo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente baseadas no `.env.example`:
   Crie um arquivo `.env.local` na raiz do projeto e adicione a chave da IA escolhida.
   ```bash
   cp .env.example .env.local
   ```
   **Opções para AI_PROVIDER:** `openai` ou `anthropic`. Certifique-se de preencher a respectiva `API_KEY`.

4. Execute o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Telas
> _Telas do projeto virão aqui em breve._

## Funcionalidades
- Upload de PDF para leitura de currículos.
- Extração de texto para enviar para a API da IA.
- Gráfico de Radar de qualidade do currículo e fit com a vaga.
- Exibição de habilidades esperadas vs. encontradas com crachás visuais.

## Como configurar a chave de API
Para utilizar a API do OpenAI (padrão) ou Anthropic, cadastre-se no site respectivo, gere uma _secret key_, e insira dentro do seu arquivo `.env.local` correspondente sem aspas. A API route fará uso seguro dessas credenciais via backend.

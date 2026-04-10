# Chat API

API em Node.js + Express + TypeScript para gerar respostas com Gemini.

## Objetivo

Este projeto expoe uma rota de chat protegida por `x-api-key`, usa um prompt base para orientar a IA e esta preparado para rodar localmente e na Vercel.

## Estrutura

```text
src/
  app.ts
  server.ts
  Module/
    Chat/
      ChatRoutes.ts
      ChatController.ts
      ChatService.ts
  service/
    IAgemini/
      index.ts
      prompt.ts
```

## Como o fluxo funciona

1. `src/app.ts` monta o app do Express, aplica `helmet`, `cors`, `json` e a protecao por `x-api-key`.
2. `src/Module/Chat/ChatRoutes.ts` registra a rota `POST /chat`.
3. `src/Module/Chat/ChatController.ts` recebe o `prompt` enviado pelo cliente.
4. `src/Module/Chat/ChatService.ts` repassa o texto para a camada de IA.
5. `src/service/IAgemini/index.ts` chama o Gemini com o `systemInstruction`.
6. `src/service/IAgemini/prompt.ts` guarda o prompt base da IA.

## Rotas

### `GET /`

Rota publica para teste simples.

Resposta:

```json
"ok"
```

### `GET /health`

Rota publica para verificacao de saude da API.

Resposta:

```json
{
  "status": "ok"
}
```

### `POST /chat`

Rota protegida por `x-api-key`.

Headers:

```text
x-api-key: sua_chave
Content-Type: application/json
```

Body:

```json
{
  "prompt": "Explique o que e uma API REST"
}
```

Resposta:

```json
{
  "response": "..."
}
```

## Prompt base da IA

O comportamento da IA nao fica no `.env`.

Ele fica em:

- `src/service/IAgemini/prompt.ts`

Esse arquivo define o contexto e as regras fixas da IA, como idioma, estilo de resposta e informacoes do seu projeto.

Use `.env` apenas para configuracoes sensiveis ou variaveis de ambiente, como:

- `GEMINI_API_KEY`
- `CLIENT_API_KEY`
- `FRONTEND_URL`
- `PORT`

## Variaveis de ambiente

Crie um arquivo `.env` com:

```env
GEMINI_API_KEY=sua_chave_gemini
CLIENT_API_KEY=sua_chave_interna
FRONTEND_URL=http://localhost:3000
PORT=3000
```

`FRONTEND_URL` tambem pode receber multiplas origens separadas por virgula, por exemplo `http://localhost:5173,https://seu-front.vercel.app`. O backend normaliza a barra final automaticamente.

## Scripts

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Producao local

```bash
npm start
```

## Deploy na Vercel

O projeto esta preparado para subir na Vercel com:

- `src/app.ts` exportando o app do Express
- `vercel.json` configurando o projeto

Configure na Vercel estas variaveis:

- `GEMINI_API_KEY`
- `CLIENT_API_KEY`
- `FRONTEND_URL`

## Observacoes

- `GET /` e `GET /health` sao publicas.
- `POST /chat` exige `x-api-key`.
- O prompt base da IA fica no codigo, nao no `.env`.

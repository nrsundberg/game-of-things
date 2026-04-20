# The Game of Things — Tabledeck Edition

A real-time, host-controlled version of The Game of Things built on the Tabledeck stack: React Router 7 on Cloudflare Workers, Prisma D1 for game metadata, Durable Objects for live player state, and the `@tabledeck/game-room` shared library for WebSocket session management. Hosted at `things.tabledeck.us`.

The host creates a game, shares a link, and controls the prompt, player list (add/remove/toggle IN↔OUT), and round notes. Viewers open the shareable link and see everything update in real time — no controls, no sign-in required. Host identity is a cookie (`got_<gameId>`) set at game creation.

## Development

```bash
npm install
npm run dev          # vite dev server on port 3004
```

## Deploy

```bash
# First deploy only: create the D1 database and paste the ID into wrangler.jsonc
npx wrangler d1 create game-of-things

npm run build
npm run d1:migrate   # apply migrations to remote D1
wrangler deploy
```

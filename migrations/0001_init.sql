-- Migration: 0001_init
-- Game table for game-of-things app

CREATE TABLE "Game" (
  "id"        TEXT PRIMARY KEY,
  "hostName"  TEXT NOT NULL DEFAULT '',
  "topic"     TEXT NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");

import { data } from "react-router";
import type { Route } from "./+types/game";
import { getPrisma } from "~/db.server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { makeGuestCookieHeader } from "@tabledeck/game-room/server";

const CreateGameSchema = z.object({
  hostName: z.string().min(1).max(24),
  topic: z.string().max(280).default(""),
});

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    throw data({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await request.json();
  const parsed = CreateGameSchema.safeParse(body);
  if (!parsed.success) {
    throw data({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { hostName, topic } = parsed.data;
  const gameId = nanoid(6);

  const db = getPrisma(context);

  // Create DB record — just stores cosmetic metadata
  await db.game.create({
    data: {
      id: gameId,
      hostName,
      topic,
    },
  });

  // Initialize the Durable Object with settings
  const env = (context as any).cloudflare.env as Env;
  const doId = env.GOT_ROOM.idFromName(gameId);
  const stub = env.GOT_ROOM.get(doId);

  await stub.fetch(
    new Request("http://internal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        settings: {
          maxPlayers: 1,
          hostName,
          topic,
        },
      }),
    }),
  );

  // Set host cookie so the creator gets host controls
  const hostCookie = makeGuestCookieHeader(
    `got_${gameId}`,
    0,
    hostName,
  );

  return data(
    { gameId },
    {
      headers: {
        "Set-Cookie": hostCookie,
      },
    },
  );
}

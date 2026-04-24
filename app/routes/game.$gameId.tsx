import React, { useState, useCallback, useRef, useEffect } from "react";
import { data } from "react-router";
import type { Route } from "./+types/game.$gameId";
import { getPrisma } from "~/db.server";
import { useGameWebSocket } from "@tabledeck/game-room/client";
import { readGuestCookie } from "@tabledeck/game-room/server";
import type { GotState } from "~/domain/types";
import type { ServerMessage } from "~/domain/messages";

import BtnPrimary from "~/components/tabledeck/BtnPrimary";
import BtnSecondary from "~/components/tabledeck/BtnSecondary";
import Plaque from "~/components/tabledeck/Plaque";
import Pin from "~/components/icons/Pin";
import Strike from "~/components/icons/Strike";
import TrashIcon from "~/components/icons/TrashIcon";
import LinkIcon from "~/components/icons/LinkIcon";
import PencilIcon from "~/components/icons/PencilIcon";
import PlusIcon from "~/components/icons/PlusIcon";
import CloseIcon from "~/components/icons/CloseIcon";

export function meta({ data: loaderData }: Route.MetaArgs) {
  const hostName = (loaderData as any)?.hostName || "Host";
  return [{ title: `The Game of Things — ${hostName}'s table` }];
}

// ── Rotation seeds so each player note gets a consistent tilt ─────────────────
const PIN_ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -1.8, 1.2, -2.2, 2.0, -0.8, 1.5];

// ── Loader ────────────────────────────────────────────────────────────────────

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const { gameId } = params;
  const db = getPrisma(context);

  const game = await db.game.findUnique({ where: { id: gameId } });
  if (!game) throw data({ error: "Game not found" }, { status: 404 });

  // Determine host identity from cookie
  const identity = readGuestCookie(request, `got_${gameId}`);
  const isHost = identity?.seat === 0;
  const myName = identity?.name ?? "Spectator";

  // Fetch initial state from Durable Object
  const env = (context as any).cloudflare?.env as Env | undefined;
  let initialState: GotState | null = null;
  if (env) {
    try {
      const doId = env.GOT_ROOM.idFromName(gameId);
      const stub = env.GOT_ROOM.get(doId);
      const res = await stub.fetch(new Request("http://internal/state"));
      if (res.ok) {
        const body = (await res.json()) as { state: GotState };
        initialState = body.state;
      }
    } catch {
      // Non-fatal — WS connect will hydrate state
    }
  }

  const url = new URL(request.url);
  const shareUrl = `${url.protocol}//${url.host}/game/${gameId}`;

  return {
    gameId,
    hostName: game.hostName,
    isHost,
    myName,
    mySeat: isHost ? 0 : -1,
    initialState,
    shareUrl,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GameRoom({ loaderData }: Route.ComponentProps) {
  const { gameId, hostName, isHost, myName, mySeat, initialState, shareUrl } =
    loaderData;

  // ── State ──────────────────────────────────────────────────────────────────
  const [gotState, setGotState] = useState<GotState | null>(initialState);
  const [copied, setCopied] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const { send } = useGameWebSocket({
    gameId,
    seat: mySeat,
    name: myName,
    onMessage: useCallback((rawMsg: unknown) => {
      const msg = rawMsg as { type: string } & ServerMessage;
      if (msg.type === "state_updated") {
        setGotState(msg.state);
      } else if (msg.type === "game_state") {
        // Initial state push from the DO on connection
        const s = (msg as any).state as GotState;
        if (s) setGotState(s);
      }
    }, []),
  });

  // ── Copy share link ────────────────────────────────────────────────────────
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback: silent fail
    }
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const topic = gotState?.topic ?? "";
  const players = gotState?.players ?? [];
  const notes = gotState?.notes ?? "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "clamp(16px, 4vw, 40px) clamp(16px, 5vw, 48px)",
      }}
    >
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <header
        className="w-full"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 32,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {/* Title plaque */}
        <Plaque style={{ padding: "16px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 600,
                color: "var(--ink)",
                fontSize: "clamp(20px, 3.5vw, 34px)",
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              The Game of Things
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                fontSize: "10.5px",
                letterSpacing: "0.32em",
                color: "rgba(42,31,22,0.5)",
                marginTop: 4,
              }}
            >
              Hosted by {hostName}
            </span>
          </div>
        </Plaque>

        {/* Action chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {isHost ? (
            <>
              {/* SHARE LINK */}
              <button
                onClick={copyLink}
                className="td-ticket-bone"
                type="button"
                aria-label="Copy share link"
              >
                <LinkIcon size={13} />
                <span style={{ fontFamily: "var(--serif)", fontVariant: "small-caps", letterSpacing: "0.18em", fontSize: 12 }}>Share Link</span>
              </button>
              {/* RESET ROUND */}
              <button
                onClick={() => setResetModalOpen(true)}
                className="td-ticket-bone"
                type="button"
                aria-label="Reset round"
              >
                <span style={{ fontFamily: "var(--serif)", fontVariant: "small-caps", letterSpacing: "0.18em", fontSize: 12 }}>Reset Round</span>
              </button>
            </>
          ) : (
            /* VIEWING chip — non-interactive */
            <div className="td-ticket" style={{ cursor: "default" }}>
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontVariant: "small-caps",
                  letterSpacing: "0.2em",
                  fontSize: 11,
                  color: "rgba(42,31,22,0.6)",
                }}
              >
                Viewing
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── Prompt Card ──────────────────────────────────────────────────── */}
      <PromptCard topic={topic} isHost={isHost} onSetTopic={(t) => send({ type: "set_topic", topic: t })} />

      {/* ── Add Player Form (host only) ───────────────────────────────────── */}
      {isHost && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <AddPlayerForm onAdd={(name) => send({ type: "add_player", name })} />
        </div>
      )}

      {/* ── Player Board ──────────────────────────────────────────────────── */}
      <PlayerBoard
        players={players}
        isHost={isHost}
        onToggle={(name) => send({ type: "toggle_player", name })}
        onRemove={(name) => send({ type: "remove_player", name })}
        onScore={(name, delta) => send({ type: "increment_score", name, delta })}
      />

      {/* ── Scoreboard (compact, live) ────────────────────────────────────── */}
      <Scoreboard
        players={players}
        isHost={isHost}
        onResetScores={() => send({ type: "reset_scores" })}
      />

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      <NotesSection
        notes={notes}
        isHost={isHost}
        onSetNotes={(n) => send({ type: "set_notes", notes: n })}
      />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: 48,
          textAlign: "center",
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: "10.5px",
          letterSpacing: "0.28em",
          color: "rgba(42,31,22,0.35)",
          borderTop: "1px solid rgba(42,31,22,0.12)",
          paddingTop: 14,
        }}
      >
        Tabledeck · The Game of Things · 2026 · Made for the Table
      </footer>

      {/* ── COPIED toast ────────────────────────────────────────────────── */}
      {copied && <div className="td-toast-stamp">Copied</div>}

      {/* ── RESET ROUND modal ────────────────────────────────────────────── */}
      {resetModalOpen && (
        <ResetModal
          onCancel={() => setResetModalOpen(false)}
          onConfirm={() => {
            send({ type: "reset_round" });
            setResetModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ── PromptCard ────────────────────────────────────────────────────────────────

function PromptCard({
  topic,
  isHost,
  onSetTopic,
}: {
  topic: string;
  isHost: boolean;
  onSetTopic: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(topic);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external topic changes (from WS) into draft when not editing
  useEffect(() => {
    if (!editing) setDraft(topic);
  }, [topic, editing]);

  const commitEdit = () => {
    setEditing(false);
    if (draft.trim() !== topic) {
      onSetTopic(draft.trim());
    }
  };

  return (
    <section style={{ width: "100%", maxWidth: 540, margin: "0 auto 32px" }}>
      <div
        className="td-card"
        style={{ background: "#fdf8f0", padding: "28px 28px 22px", borderRadius: "9px" }}
      >
        {/* Mustard rubber-stamp circle ornament */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-18px",
            right: "-14px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 38%, #e8c050 0%, #d9a62a 60%, #b8881e 100%)",
            boxShadow: "inset 0 2px 2px rgba(255,255,255,0.35), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-10deg)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <text
              x="14"
              y="18"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontVariant="small-caps"
              fontWeight="700"
              fontSize="9"
              letterSpacing="0.5"
              fill="#2a1f16"
              opacity="0.85"
            >
              THINGS
            </text>
          </svg>
        </div>

        {/* Prompt text or editing textarea */}
        {isHost && editing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commitEdit();
              }
              if (e.key === "Escape") {
                setDraft(topic);
                setEditing(false);
              }
            }}
            autoFocus
            rows={2}
            placeholder="Click to set a prompt…"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1.5px solid rgba(200,55,42,0.4)",
              outline: "none",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2.5vw, 24px)",
              lineHeight: 1.35,
              letterSpacing: "0.01em",
              color: "var(--ink)",
              resize: "none",
              padding: "2px 0",
              zIndex: 1,
              position: "relative",
            }}
          />
        ) : (
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              className="font-serif italic"
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                color: "var(--ink)",
                fontSize: "clamp(17px, 2.5vw, 24px)",
                lineHeight: 1.35,
                letterSpacing: "0.01em",
                margin: 0,
                cursor: isHost ? "pointer" : "default",
                minHeight: 32,
              }}
              onClick={isHost ? () => setEditing(true) : undefined}
              title={isHost ? "Click to edit prompt" : undefined}
            >
              {topic || (
                <span style={{ color: "rgba(42,31,22,0.35)", fontStyle: "italic" }}>
                  {isHost ? "Click to set a prompt…" : "No prompt set yet"}
                </span>
              )}
            </p>
            {/* Edit hint icon — visible on hover for host */}
            {isHost && topic && (
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit prompt"
                style={{
                  position: "absolute",
                  top: 0,
                  right: -4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(42,31,22,0.3)",
                  padding: 2,
                  opacity: 0,
                  transition: "opacity 0.15s",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <PencilIcon size={14} />
              </button>
            )}
          </div>
        )}

        {/* Caveat flavor annotation — only shown while no real prompt is set,
            so the example disappears as soon as the host types something
            (either committed or still being drafted). */}
        {!topic.trim() && !draft.trim() && (
          <p
            style={{
              fontFamily: "var(--script)",
              fontSize: "17px",
              color: "rgba(42,31,22,0.5)",
              marginTop: 12,
              marginBottom: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            e.g. — what you would regret the moment it leaves your mouth
          </p>
        )}

        {/* Ruled-line decorative bottom strip */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            marginTop: 20,
            height: "3px",
            background: "repeating-linear-gradient(90deg, var(--cocktail) 0 6px, transparent 6px 10px)",
            opacity: 0.4,
            borderRadius: "2px",
            zIndex: 1,
          }}
        />
      </div>
    </section>
  );
}

// ── PlayerBoard ───────────────────────────────────────────────────────────────

function PlayerBoard({
  players,
  isHost,
  onToggle,
  onRemove,
  onScore,
}: {
  players: { name: string; isOut: boolean; score: number }[];
  isHost: boolean;
  onToggle: (name: string) => void;
  onRemove: (name: string) => void;
  onScore: (name: string, delta: number) => void;
}) {
  if (!players || players.length === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 40 }}>
        <p
          style={{
            fontFamily: "var(--script)",
            fontSize: "20px",
            color: "rgba(42,31,22,0.4)",
            margin: 0,
          }}
        >
          {isHost
            ? "No players yet — add some names above"
            : "No players yet — host hasn't seated anyone yet"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(116px, 1fr))",
        gap: 24,
        justifyItems: "center",
        maxWidth: 860,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {players.map((player, i) => (
        <PlayerCard
          key={player.name}
          name={player.name}
          isOut={player.isOut}
          score={player.score ?? 0}
          rotIndex={i}
          isHost={isHost}
          onToggle={() => onToggle(player.name)}
          onRemove={() => onRemove(player.name)}
          onScore={() => onScore(player.name, 1)}
        />
      ))}
    </div>
  );
}

// ── PlayerCard ────────────────────────────────────────────────────────────────

function PlayerCard({
  name,
  isOut,
  score,
  rotIndex,
  isHost,
  onToggle,
  onRemove,
  onScore,
}: {
  name: string;
  isOut: boolean;
  score: number;
  rotIndex: number;
  isHost: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onScore: () => void;
}) {
  const rot = PIN_ROTATIONS[rotIndex % PIN_ROTATIONS.length];

  const cardProps = isHost
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-pressed": isOut,
        "aria-label": `${name} — ${isOut ? "out" : "in"}. Click to toggle.`,
        onClick: onToggle,
        onKeyDown: (e: React.KeyboardEvent) =>
          (e.key === "Enter" || e.key === " ") && onToggle(),
      }
    : {
        "aria-label": `${name} — ${isOut ? "out" : "in"}`,
      };

  return (
    <div
      className={`td-pinned${isOut ? " is-out" : ""}${!isHost ? " viewer-mode" : ""}`}
      style={{ "--pin-rot": `${rot}deg` } as React.CSSProperties}
      {...cardProps}
    >
      {/* Push pin */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
          pointerEvents: "none",
        }}
      >
        <Pin size={22} color={isOut ? "#888" : "#c8372a"} />
      </div>

      {/* Status wax stamp (IN) */}
      {!isOut && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 38%, #e0483c 0%, #c8372a 60%, #8f1e16 100%)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-8deg)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <text
              x="8"
              y="11.5"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontWeight="700"
              fontSize="8"
              letterSpacing="0.3"
              fill="rgba(255,255,255,0.9)"
            >
              IN
            </text>
          </svg>
        </div>
      )}

      {/* Name */}
      <div
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 600,
          fontSize: "19px",
          textAlign: "center",
          lineHeight: 1.2,
          color: "var(--ink)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {name}
      </div>

      {/* Strike-through when OUT */}
      {isOut && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 4, position: "relative", zIndex: 1 }}
        >
          <Strike width={name.length * 8 + 16} height={3} color="rgba(200,55,42,0.65)" />
        </div>
      )}

      {/* Score row — score chip on the left, +1 button on the right (host only).
          Shown on every card so viewers can see scores too. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          aria-label={`${name} has ${score} point${score === 1 ? "" : "s"}`}
          style={{
            fontFamily: "var(--serif)",
            fontVariant: "small-caps",
            letterSpacing: "0.12em",
            fontSize: 11,
            color: "rgba(42,31,22,0.6)",
          }}
        >
          {score} pt{score === 1 ? "" : "s"}
        </span>
        {isHost && (
          <button
            type="button"
            aria-label={`Award a point to ${name}`}
            title="Guessed correctly — +1 point"
            onClick={(e) => {
              e.stopPropagation();
              onScore();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 26,
              height: 22,
              padding: "0 7px",
              borderRadius: 11,
              border: "1px solid rgba(42,31,22,0.25)",
              background: "#fdf8f0",
              cursor: "pointer",
              fontFamily: "var(--serif)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: 1,
              color: "var(--ink)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3e6c8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fdf8f0";
            }}
          >
            +1
          </button>
        )}
      </div>

      {/* Remove button — host only */}
      {isHost && (
        <button
          className="absolute bottom-2 right-2 transition-opacity"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(42,31,22,0.3)",
            padding: "2px",
            zIndex: 2,
            lineHeight: 1,
          }}
          aria-label={`Remove ${name}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c8372a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(42,31,22,0.3)")}
          type="button"
        >
          <TrashIcon size={13} />
        </button>
      )}
    </div>
  );
}

// ── Scoreboard ────────────────────────────────────────────────────────────────

function Scoreboard({
  players,
  isHost,
  onResetScores,
}: {
  players: { name: string; score: number }[];
  isHost: boolean;
  onResetScores: () => void;
}) {
  const [open, setOpen] = useState(true);
  if (!players || players.length === 0) return null;

  // Sort by score desc, then name for stability.
  const ranked = [...players].sort((a, b) => {
    const s = (b.score ?? 0) - (a.score ?? 0);
    return s !== 0 ? s : a.name.localeCompare(b.name);
  });

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 640,
        margin: "32px auto 0",
      }}
    >
      <div
        className="td-card"
        style={{
          background: "#fdf8f0",
          padding: "14px 20px",
          borderRadius: 9,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="got-scoreboard-body"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.14em",
              color: "var(--ink)",
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 10, opacity: 0.5 }}>
              {open ? "▾" : "▸"}
            </span>
            Scoreboard
          </button>
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: 1,
              background:
                "repeating-linear-gradient(90deg, rgba(42,31,22,0.3) 0 4px, transparent 4px 8px)",
            }}
          />
          {isHost && open && (
            <button
              type="button"
              onClick={onResetScores}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.18em",
                fontSize: 11,
                color: "rgba(42,31,22,0.55)",
                padding: "2px 4px",
              }}
              title="Reset all scores to zero"
            >
              Reset
            </button>
          )}
        </div>

        {/* Body */}
        {open && (
          <ul
            id="got-scoreboard-body"
            style={{
              listStyle: "none",
              margin: "10px 0 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "6px 18px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {ranked.map((p) => (
              <li
                key={p.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                  fontFamily: "var(--serif)",
                  fontSize: 15,
                  color: "var(--ink)",
                  borderBottom: "1px dotted rgba(42,31,22,0.2)",
                  padding: "2px 0",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontVariant: "tabular-nums",
                    color: "var(--ink)",
                  }}
                >
                  {p.score ?? 0}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── AddPlayerForm ─────────────────────────────────────────────────────────────

function AddPlayerForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label
          className="sc"
          htmlFor="add-player-input"
          style={{
            fontFamily: "var(--serif)",
            fontVariant: "small-caps",
            fontSize: "10.5px",
            letterSpacing: "0.2em",
            color: "rgba(42,31,22,0.55)",
          }}
        >
          Add Player
        </label>
        <input
          id="add-player-input"
          type="text"
          placeholder="a name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="td-input"
          style={{ width: "180px" }}
          maxLength={24}
        />
      </div>
      <BtnPrimary
        onClick={handleAdd}
        type="button"
        style={{ paddingTop: "8px", paddingBottom: "8px" }}
      >
        <PlusIcon size={14} />
        Add
      </BtnPrimary>
    </div>
  );
}

// ── NotesSection ──────────────────────────────────────────────────────────────

function NotesSection({
  notes,
  isHost,
  onSetNotes,
}: {
  notes: string;
  isHost: boolean;
  onSetNotes: (n: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localNotes, setLocalNotes] = useState(notes);

  // Sync external notes when WS updates arrive (only if not actively editing)
  const isEditingRef = useRef(false);
  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalNotes(notes);
    }
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalNotes(val);
    isEditingRef.current = true;
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    // Debounce send
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSetNotes(val);
      isEditingRef.current = false;
    }, 250);
  };

  return (
    <section style={{ width: "100%", maxWidth: 640, margin: "32px auto 0" }}>
      <div className="td-scroll">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(42,31,22,0.15)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.14em",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Round Notes
          </h2>
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background:
                "repeating-linear-gradient(90deg, rgba(42,31,22,0.3) 0 4px, transparent 4px 8px)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--script)",
              fontSize: "16px",
              color: "rgba(42,31,22,0.4)",
            }}
          >
            who said what
          </span>
        </div>

        {isHost ? (
          <textarea
            ref={textareaRef}
            className="td-notebook"
            placeholder="jot it down..."
            value={localNotes}
            onChange={handleChange}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = t.scrollHeight + "px";
            }}
            rows={4}
          />
        ) : (
          <div className="td-notebook-readonly">
            {localNotes || (
              <span
                style={{
                  fontFamily: "var(--script)",
                  fontSize: 16,
                  color: "rgba(42,31,22,0.35)",
                  fontStyle: "italic",
                }}
              >
                (host hasn&apos;t written any notes yet)
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ── ResetModal ────────────────────────────────────────────────────────────────

function ResetModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-scroll-overlay">
      <div className="modal-scroll">
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "0.14em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Reset the Round?
            </h3>
            <button
              onClick={onCancel}
              type="button"
              aria-label="Cancel"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(42,31,22,0.45)",
                padding: 2,
                marginTop: 2,
              }}
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-soft)",
              margin: "0 0 6px",
              lineHeight: 1.5,
            }}
          >
            All players will be flipped back to IN. Your notes and topic stay.
          </p>
          <p
            style={{
              fontFamily: "var(--script)",
              fontSize: 17,
              color: "rgba(42,31,22,0.45)",
              margin: "0 0 20px",
            }}
          >
            fresh prompt, fresh start
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <BtnSecondary onClick={onCancel} type="button">
              Cancel
            </BtnSecondary>
            <BtnPrimary onClick={onConfirm} type="button">
              Reset
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

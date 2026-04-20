import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/_index";
import BtnPrimary from "~/components/tabledeck/BtnPrimary";

export function meta() {
  return [
    { title: "The Game of Things — Tabledeck Edition" },
    {
      name: "description",
      content:
        "Play The Game of Things with friends. Pick a prompt, share a link, and see who said what.",
    },
  ];
}

export async function loader() {
  return {};
}

export default function Index(_: Route.ComponentProps) {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [hostName, setHostName] = useState("");
  const [topic, setTopic] = useState("");
  const [hostNameError, setHostNameError] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const createGame = async () => {
    // Validate host name
    if (!hostName.trim()) {
      setHostNameError(true);
      return;
    }
    setHostNameError(false);
    setSubmitError("");
    setCreating(true);

    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName: hostName.trim(),
          topic: topic.trim(),
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setSubmitError(body.error ?? "Failed to create game.");
        setCreating(false);
        return;
      }
      const { gameId } = (await res.json()) as { gameId: string };
      navigate(`/game/${gameId}`);
    } catch {
      setSubmitError("Network error. Please try again.");
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Back link */}
      <a
        href="https://tabledeck.us"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: 11,
          letterSpacing: "0.22em",
          color: "rgba(42,31,22,0.5)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(42,31,22,0.5)")}
      >
        &larr; Return to Tabledeck
      </a>

      {/* Hero wordmark */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(32px, 6vw, 52px)",
            color: "var(--ink)",
            letterSpacing: "0.02em",
            margin: "0 0 4px",
          }}
        >
          The Game of Things
        </h1>
        {/* Gold rule */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,var(--gold) 30%,var(--mustard) 50%,var(--gold) 70%,transparent)",
            margin: "6px auto 10px",
            width: 240,
          }}
        />
        <p
          style={{
            fontFamily: "var(--serif)",
            fontVariant: "small-caps",
            fontSize: 11,
            letterSpacing: "0.32em",
            color: "rgba(42,31,22,0.45)",
            margin: "0 0 6px",
          }}
        >
          Tabledeck Edition
        </p>
        <p
          style={{
            fontFamily: "var(--script)",
            fontSize: 20,
            color: "rgba(42,31,22,0.45)",
            margin: 0,
          }}
        >
          pick a prompt. pass it around.
        </p>
      </div>

      {/* Create form */}
      <div className="lobby-card" style={{ position: "relative" }}>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 24px" }}>

          {/* HOST NAME */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="hostName"
              style={{
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.22em",
                fontSize: 11,
                color: "var(--ink-faint)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Host
            </label>
            <input
              id="hostName"
              type="text"
              value={hostName}
              onChange={(e) => {
                setHostName(e.target.value);
                if (e.target.value.trim()) setHostNameError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && createGame()}
              placeholder="your name..."
              maxLength={24}
              className="td-input"
              style={{ width: "100%" }}
              aria-invalid={hostNameError}
              aria-describedby={hostNameError ? "host-name-error" : undefined}
            />
            {hostNameError && (
              <p
                id="host-name-error"
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--wine-mid)",
                  margin: "6px 0 0",
                }}
              >
                Your name is required.
              </p>
            )}
          </div>

          {/* TOPIC */}
          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="topic"
              style={{
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.22em",
                fontSize: 11,
                color: "var(--ink-faint)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Prompt{" "}
              <span style={{ fontVariant: "normal", fontSize: 10 }}>(optional)</span>
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Name something you'd never say at Thanksgiving."
              maxLength={280}
              rows={2}
              className="td-input"
              style={{
                width: "100%",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 15,
                resize: "none",
              }}
            />
          </div>

          {submitError && (
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--wine-mid)",
                marginBottom: 12,
              }}
            >
              {submitError}
            </p>
          )}

          <BtnPrimary
            onClick={createGame}
            disabled={creating || !hostName.trim()}
            style={{ width: "100%" }}
            type="button"
          >
            {creating ? "Starting..." : "Start"}
          </BtnPrimary>

          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              color: "var(--ink-faint)",
              textAlign: "center",
              marginTop: 14,
              marginBottom: 0,
            }}
          >
            You'll get a shareable link — anyone with it can watch live
          </p>
        </div>
      </div>
    </div>
  );
}

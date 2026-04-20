import { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import Pin from "./components/icons/Pin";
import Strike from "./components/icons/Strike";

// ─── Rotation seeds so each player note gets a consistent tilt ───────────────
const PIN_ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -1.8, 1.2, -2.2, 2.0, -0.8, 1.5];

// ─── Default players ──────────────────────────────────────────────────────────
const defaultNames = [
  "Zach", "Elle", "Reece", "Ella", "Maggie",
  "Kim", "Bekah", "Jacob", "Dmitri", "Noah",
];

// ─── Masthead ─────────────────────────────────────────────────────────────────
function Masthead({ networkUrl }) {
  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
      {/* Title plaque */}
      <div className="td-plaque px-8 py-4 flex flex-col items-center">
        <span
          className="block font-serif italic text-ink"
          style={{ fontSize: "clamp(22px, 4vw, 38px)", lineHeight: 1, letterSpacing: "0.02em" }}
        >
          The Game of Things
        </span>
        <span
          className="block font-serif mt-1"
          style={{
            fontVariant: "small-caps",
            fontSize: "10.5px",
            letterSpacing: "0.32em",
            color: "rgba(42,31,22,0.5)",
          }}
        >
          Tabledeck Edition
        </span>
      </div>

      {/* Network chip */}
      {networkUrl && <NetworkChip url={networkUrl} />}
    </header>
  );
}

// ─── NetworkChip ──────────────────────────────────────────────────────────────
function NetworkChip({ url }) {
  return (
    <div className="td-ticket">
      <span
        style={{
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: "10px",
          letterSpacing: "0.2em",
          display: "block",
          lineHeight: 1,
          marginBottom: "2px",
          color: "rgba(42,31,22,0.65)",
        }}
      >
        Join at
      </span>
      <span className="font-mono text-ink text-xs font-medium tracking-tight">{url}</span>
    </div>
  );
}

// ─── PromptCard ───────────────────────────────────────────────────────────────
function PromptCard() {
  return (
    <section className="w-full max-w-lg mx-auto mb-8">
      <div
        className="td-card relative"
        style={{
          background: "#fdf8f0",
          padding: "28px 28px 22px",
          borderRadius: "9px",
        }}
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

        {/* Prompt text */}
        <p
          className="font-serif italic text-ink relative"
          style={{ fontSize: "clamp(17px, 2.5vw, 24px)", lineHeight: 1.35, letterSpacing: "0.01em", zIndex: 1 }}
        >
          Name something you would never say at Thanksgiving.
        </p>

        {/* Caveat flavor annotation */}
        <p
          className="font-script mt-3 relative"
          style={{ fontSize: "17px", color: "rgba(42,31,22,0.5)", zIndex: 1 }}
        >
          e.g. — what you would regret the moment it leaves your mouth
        </p>

        {/* Ruled-line decorative bottom strip */}
        <div
          aria-hidden="true"
          className="relative mt-5"
          style={{
            height: "3px",
            background: "repeating-linear-gradient(90deg, var(--cocktail) 0 6px, transparent 6px 10px)",
            opacity: 0.4,
            borderRadius: "2px",
          }}
        />
      </div>
    </section>
  );
}

// ─── PlayerCard (pinned note) ─────────────────────────────────────────────────
function PlayerCard({ name, isOut, rotIndex, onToggle, onRemove }) {
  const rot = PIN_ROTATIONS[rotIndex % PIN_ROTATIONS.length];

  return (
    <div
      className={`td-pinned${isOut ? " is-out" : ""}`}
      style={{ "--pin-rot": `${rot}deg` }}
      role="button"
      tabIndex={0}
      aria-pressed={isOut}
      aria-label={`${name} — ${isOut ? "out" : "in"}. Click to toggle.`}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
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
        className="font-serif text-ink relative"
        style={{
          fontSize: "17px",
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.2,
          zIndex: 1,
          textDecoration: "none",
        }}
      >
        {name}
      </div>

      {/* Strike-through when OUT */}
      {isOut && (
        <div className="flex justify-center mt-1 relative" style={{ zIndex: 1 }}>
          <Strike width={name.length * 8 + 16} height={3} color="rgba(200,55,42,0.65)" />
        </div>
      )}

      {/* Remove button */}
      <button
        className="absolute bottom-2 right-2 transition-opacity"
        style={{
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
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ─── PlayerBoard ──────────────────────────────────────────────────────────────
function PlayerBoard({ people, clicked, onToggle, onRemove }) {
  if (!people || people.length === 0) {
    return (
      <div className="text-center py-10">
        <p
          className="font-script"
          style={{ fontSize: "20px", color: "rgba(42,31,22,0.4)" }}
        >
          No players yet — add some names above
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-6 justify-items-center w-full"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      {people.map((name, i) => (
        <PlayerCard
          key={name}
          name={name}
          isOut={!!clicked[name]}
          rotIndex={i}
          onToggle={() => onToggle(name)}
          onRemove={() => onRemove(name)}
        />
      ))}
    </div>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────
function Notes({ notes, setNotes }) {
  const textareaRef = useRef(null);
  // Use a single global notes string (the original used `notes[name]` but `name` was out-of-scope)
  const value = typeof notes === "string" ? notes : "";

  const handleChange = (e) => {
    setNotes(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-8">
      <div className="td-scroll">
        <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(42,31,22,0.15)" }}>
          <h2
            className="font-serif m-0"
            style={{ fontVariant: "small-caps", fontWeight: 600, fontSize: "16px", letterSpacing: "0.14em", color: "var(--ink)" }}
          >
            Round Notes
          </h2>
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background: "repeating-linear-gradient(90deg, rgba(42,31,22,0.3) 0 4px, transparent 4px 8px)",
            }}
          />
          <span className="font-script" style={{ fontSize: "16px", color: "rgba(42,31,22,0.4)" }}>
            who said what
          </span>
        </div>
        <textarea
          ref={textareaRef}
          className="td-notebook"
          placeholder="jot it down..."
          value={value}
          onChange={handleChange}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          rows={4}
        />
      </div>
    </section>
  );
}

// ─── AddPlayerForm ────────────────────────────────────────────────────────────
function AddPlayerForm({ newName, setNewName, onAdd }) {
  return (
    <div className="flex items-end gap-3 mb-8">
      <div className="flex flex-col gap-1">
        <label
          className="sc"
          htmlFor="add-player-input"
          style={{ fontVariant: "small-caps", fontFamily: "var(--serif)", fontSize: "10.5px", letterSpacing: "0.2em", color: "rgba(42,31,22,0.55)" }}
        >
          Add Player
        </label>
        <input
          id="add-player-input"
          type="text"
          placeholder="a name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          className="td-input"
          style={{ width: "180px" }}
        />
      </div>
      <button className="td-btn-primary" onClick={onAdd} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        Add
      </button>
    </div>
  );
}

// ─── App (root) ───────────────────────────────────────────────────────────────
export default function App() {
  const [people, setPeople]     = useState(undefined);
  const [newName, setNewName]   = useState("");
  const [clicked, setClicked]   = useState({});
  const [notes, setNotes]       = useState("");
  const [networkUrl, setNetworkUrl] = useState("");

  // Get actual network IP
  useEffect(() => {
    fetch("/api/network-info")
      .then((res) => res.json())
      .then((data) => {
        const url = `http://${data.ip}:${data.port}`;
        setNetworkUrl(url);
      })
      .catch(() => {
        setNetworkUrl(window.location.origin);
      });
  }, []);

  // Initialize from localStorage or defaults
  useEffect(() => {
    if (people === undefined) {
      const stored = localStorage.getItem("people-list");
      if (stored !== null && stored?.length > 2) {
        setPeople(JSON.parse(stored));
      } else {
        setPeople(defaultNames);
        localStorage.setItem("people-list", JSON.stringify(defaultNames));
      }
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("people-list");
    if (stored !== null && people !== undefined) {
      localStorage.setItem("people-list", JSON.stringify(people));
    }
  }, [people]);

  const handleAdd = () => {
    const name = newName.trim();
    if (name && !people.includes(name)) {
      setPeople([...people, name]);
      setNewName("");
    }
  };

  const handleRemove = (nameToRemove) => {
    setPeople(people.filter((name) => name !== nameToRemove));
    setClicked((prev) => {
      const next = { ...prev };
      delete next[nameToRemove];
      return next;
    });
  };

  const handleToggle = (name) => {
    setClicked((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen" style={{ padding: "clamp(16px, 4vw, 40px) clamp(16px, 5vw, 48px)" }}>
      <Masthead networkUrl={networkUrl} />

      <PromptCard />

      <div className="flex justify-center mb-2">
        <AddPlayerForm newName={newName} setNewName={setNewName} onAdd={handleAdd} />
      </div>

      <PlayerBoard
        people={people}
        clicked={clicked}
        onToggle={handleToggle}
        onRemove={handleRemove}
      />

      <Notes notes={notes} setNotes={setNotes} />

      {/* Footer */}
      <footer
        className="mt-12 text-center"
        style={{
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: "10.5px",
          letterSpacing: "0.28em",
          color: "rgba(42,31,22,0.35)",
          borderTop: "1px solid rgba(42,31,22,0.12)",
          paddingTop: "14px",
        }}
      >
        Tabledeck · The Game of Things
      </footer>
    </div>
  );
}

import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ServerRouter, UNSAFE_withErrorBoundaryProps, useRouteError, isRouteErrorResponse, Meta, Links, Scripts, UNSAFE_withComponentProps, Outlet, ScrollRestoration, useNavigate, data } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import { isbot } from "isbot";
import { useState, useCallback, useRef, useEffect } from "react";
import * as runtime from "@prisma/client/runtime/wasm-compiler-edge";
import { PrismaD1 } from "@prisma/adapter-d1";
import { useGameWebSocket } from "@tabledeck/game-room/client";
import { readGuestCookie, makeGuestCookieHeader } from "@tabledeck/game-room/server";
import { nanoid } from "nanoid";
import { z } from "zod";
const ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  const userAgent = request.headers.get("user-agent");
  const waitForAll = userAgent && isbot(userAgent) || routerContext.isSpaMode;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
    {
      signal: controller.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  if (waitForAll) {
    await body.allReady;
  }
  clearTimeout(timeoutId);
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/app-IAeQaA-k.css";
const meta$2 = () => [{
  title: "The Game of Things — Tabledeck Edition"
}, {
  name: "description",
  content: "Play The Game of Things with friends. Share a link so everyone can follow along."
}];
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;700&family=Caveat:wght@500;600&display=swap"
}, {
  rel: "stylesheet",
  href: styles
}];
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2() {
  const error = useRouteError();
  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let statusCode = null;
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = "Not Found";
      message = "That game doesn't exist.";
    } else {
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("title", {
        children: "Error — The Game of Things"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      style: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          background: "linear-gradient(180deg, #fdf8f0 0%, var(--parchment-deep, #e2d4b0) 100%)",
          borderRadius: 8,
          padding: "32px 40px",
          textAlign: "center",
          boxShadow: "inset 0 0 0 1px rgba(42,31,22,0.18),0 12px 36px rgba(0,0,0,0.35)",
          maxWidth: 400
        },
        children: [statusCode && /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 56,
            fontWeight: 700,
            color: "#c9a24a",
            margin: "0 0 8px"
          },
          children: statusCode
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontVariant: "small-caps",
            fontSize: 24,
            fontWeight: 600,
            color: "#2a1f16",
            margin: "0 0 10px",
            letterSpacing: "0.14em"
          },
          children: title
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "Inter,system-ui,sans-serif",
            fontSize: 14,
            color: "rgba(42,31,22,0.65)",
            margin: "0 0 24px",
            maxWidth: 320
          },
          children: message
        }), /* @__PURE__ */ jsx("a", {
          href: "/",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 20px",
            border: "1px solid #8b6a1e",
            borderRadius: "999px",
            background: "linear-gradient(180deg, #e8c872 0%, #c9a24a 48%, #a77f28 100%)",
            color: "#2a1f16",
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontVariant: "small-caps",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.22em",
            textDecoration: "none"
          },
          children: "New Game"
        })]
      }), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: root,
  links,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function BtnPrimary({
  children,
  className = "",
  ...rest
}) {
  return /* @__PURE__ */ jsx("button", { className: `td-btn-primary ${className}`, ...rest, children });
}
function meta$1() {
  return [{
    title: "The Game of Things — Tabledeck Edition"
  }, {
    name: "description",
    content: "Play The Game of Things with friends. Pick a prompt, share a link, and see who said what."
  }];
}
async function loader$1() {
  return {};
}
const _index = UNSAFE_withComponentProps(function Index(_) {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [hostName, setHostName] = useState("");
  const [topic, setTopic] = useState("");
  const [hostNameError, setHostNameError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const createGame = async () => {
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hostName: hostName.trim(),
          topic: topic.trim()
        })
      });
      if (!res.ok) {
        const body = await res.json();
        setSubmitError(body.error ?? "Failed to create game.");
        setCreating(false);
        return;
      }
      const {
        gameId
      } = await res.json();
      navigate(`/game/${gameId}`);
    } catch {
      setSubmitError("Network error. Please try again.");
      setCreating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px"
    },
    children: [/* @__PURE__ */ jsx("a", {
      href: "https://tabledeck.us",
      style: {
        position: "absolute",
        top: 16,
        left: 16,
        fontFamily: "var(--serif)",
        fontVariant: "small-caps",
        fontSize: 11,
        letterSpacing: "0.22em",
        color: "rgba(42,31,22,0.5)",
        textDecoration: "none"
      },
      onMouseEnter: (e) => e.currentTarget.style.color = "var(--ink)",
      onMouseLeave: (e) => e.currentTarget.style.color = "rgba(42,31,22,0.5)",
      children: "← Return to Tabledeck"
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        textAlign: "center",
        marginBottom: 32
      },
      children: [/* @__PURE__ */ jsx("h1", {
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "clamp(32px, 6vw, 52px)",
          color: "var(--ink)",
          letterSpacing: "0.02em",
          margin: "0 0 4px"
        },
        children: "The Game of Things"
      }), /* @__PURE__ */ jsx("div", {
        style: {
          height: 1,
          background: "linear-gradient(90deg,transparent,var(--gold) 30%,var(--mustard) 50%,var(--gold) 70%,transparent)",
          margin: "6px auto 10px",
          width: 240
        }
      }), /* @__PURE__ */ jsx("p", {
        style: {
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: 11,
          letterSpacing: "0.32em",
          color: "rgba(42,31,22,0.45)",
          margin: "0 0 6px"
        },
        children: "Tabledeck Edition"
      }), /* @__PURE__ */ jsx("p", {
        style: {
          fontFamily: "var(--script)",
          fontSize: 20,
          color: "rgba(42,31,22,0.45)",
          margin: 0
        },
        children: "pick a prompt. pass it around."
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "lobby-card",
      style: {
        position: "relative"
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          position: "relative",
          zIndex: 1,
          padding: "28px 28px 24px"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            marginBottom: 20
          },
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "hostName",
            style: {
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              letterSpacing: "0.22em",
              fontSize: 11,
              color: "var(--ink-faint)",
              display: "block",
              marginBottom: 6
            },
            children: "Host"
          }), /* @__PURE__ */ jsx("input", {
            id: "hostName",
            type: "text",
            value: hostName,
            onChange: (e) => {
              setHostName(e.target.value);
              if (e.target.value.trim()) setHostNameError(false);
            },
            onKeyDown: (e) => e.key === "Enter" && createGame(),
            placeholder: "your name...",
            maxLength: 24,
            className: "td-input",
            style: {
              width: "100%"
            },
            "aria-invalid": hostNameError,
            "aria-describedby": hostNameError ? "host-name-error" : void 0
          }), hostNameError && /* @__PURE__ */ jsx("p", {
            id: "host-name-error",
            style: {
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--wine-mid)",
              margin: "6px 0 0"
            },
            children: "Your name is required."
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            marginBottom: 24
          },
          children: [/* @__PURE__ */ jsxs("label", {
            htmlFor: "topic",
            style: {
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              letterSpacing: "0.22em",
              fontSize: 11,
              color: "var(--ink-faint)",
              display: "block",
              marginBottom: 6
            },
            children: ["Prompt", " ", /* @__PURE__ */ jsx("span", {
              style: {
                fontVariant: "normal",
                fontSize: 10
              },
              children: "(optional)"
            })]
          }), /* @__PURE__ */ jsx("textarea", {
            id: "topic",
            value: topic,
            onChange: (e) => setTopic(e.target.value),
            placeholder: "e.g. Name something you'd never say at Thanksgiving.",
            maxLength: 280,
            rows: 2,
            className: "td-input",
            style: {
              width: "100%",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 15,
              resize: "none"
            }
          })]
        }), submitError && /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--wine-mid)",
            marginBottom: 12
          },
          children: submitError
        }), /* @__PURE__ */ jsx(BtnPrimary, {
          onClick: createGame,
          disabled: creating || !hostName.trim(),
          style: {
            width: "100%"
          },
          type: "button",
          children: creating ? "Starting..." : "Start"
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "var(--sans)",
            fontSize: 11,
            color: "var(--ink-faint)",
            textAlign: "center",
            marginTop: 14,
            marginBottom: 0
          },
          children: "You'll get a shareable link — anyone with it can watch live"
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "sqlite",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../app/db"\n  runtime  = "cloudflare"\n}\n\ndatasource db {\n  provider = "sqlite"\n}\n\nmodel Game {\n  id        String   @id // nanoid(6)\n  hostName  String   @default("")\n  topic     String   @default("")\n  createdAt DateTime @default(now())\n\n  @@index([createdAt])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Game":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"hostName","kind":"scalar","type":"String"},{"name":"topic","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","Game.findUnique","Game.findUniqueOrThrow","orderBy","cursor","Game.findFirst","Game.findFirstOrThrow","Game.findMany","data","Game.createOne","Game.createMany","Game.createManyAndReturn","Game.updateOne","Game.updateMany","Game.updateManyAndReturn","create","update","Game.upsertOne","Game.deleteOne","Game.deleteMany","having","_count","_min","_max","Game.groupBy","Game.aggregate","AND","OR","NOT","id","hostName","topic","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","set"]'),
  graph: "KQkQBxoAACIAMBsAAAQAEBwAACIAMB0BAAAAAR4BACMAIR8BACMAISBAACQAIQEAAAABACABAAAAAQAgBxoAACIAMBsAAAQAEBwAACIAMB0BACMAIR4BACMAIR8BACMAISBAACQAIQADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAEHQEAAAABHgEAAAABHwEAAAABIEAAAAABAQgAAAkAIAQdAQAAAAEeAQAAAAEfAQAAAAEgQAAAAAEBCAAACwAwAQgAAAsAMAQdAQAoACEeAQAoACEfAQAoACEgQAApACECAAAAAQAgCAAADgAgBB0BACgAIR4BACgAIR8BACgAISBAACkAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgAxUAACUAIBYAACcAIBcAACYAIAcaAAAaADAbAAAXABAcAAAaADAdAQAbACEeAQAbACEfAQAbACEgQAAcACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAcaAAAaADAbAAAXABAcAAAaADAdAQAbACEeAQAbACEfAQAbACEgQAAcACEOFQAAHgAgFgAAIQAgFwAAIQAgIQEAAAABIgEAAAAEIwEAAAAEJAEAAAABJQEAAAABJgEAAAABJwEAAAABKAEAIAAhKQEAAAABKgEAAAABKwEAAAABCxUAAB4AIBYAAB8AIBcAAB8AICFAAAAAASJAAAAABCNAAAAABCRAAAAAASVAAAAAASZAAAAAASdAAAAAAShAAB0AIQsVAAAeACAWAAAfACAXAAAfACAhQAAAAAEiQAAAAAQjQAAAAAQkQAAAAAElQAAAAAEmQAAAAAEnQAAAAAEoQAAdACEIIQIAAAABIgIAAAAEIwIAAAAEJAIAAAABJQIAAAABJgIAAAABJwIAAAABKAIAHgAhCCFAAAAAASJAAAAABCNAAAAABCRAAAAAASVAAAAAASZAAAAAASdAAAAAAShAAB8AIQ4VAAAeACAWAAAhACAXAAAhACAhAQAAAAEiAQAAAAQjAQAAAAQkAQAAAAElAQAAAAEmAQAAAAEnAQAAAAEoAQAgACEpAQAAAAEqAQAAAAErAQAAAAELIQEAAAABIgEAAAAEIwEAAAAEJAEAAAABJQEAAAABJgEAAAABJwEAAAABKAEAIQAhKQEAAAABKgEAAAABKwEAAAABBxoAACIAMBsAAAQAEBwAACIAMB0BACMAIR4BACMAIR8BACMAISBAACQAIQshAQAAAAEiAQAAAAQjAQAAAAQkAQAAAAElAQAAAAEmAQAAAAEnAQAAAAEoAQAhACEpAQAAAAEqAQAAAAErAQAAAAEIIUAAAAABIkAAAAAEI0AAAAAEJEAAAAABJUAAAAABJkAAAAABJ0AAAAABKEAAHwAhAAAAASwBAAAAAQEsQAAAAAEAAAAAAxUABhYABxcACAAAAAMVAAYWAAcXAAgBAgECAwEFBgEGBwEHCAEJCgEKDAILDQMMDwENEQIOEgQREwESFAETFQIYGAUZGQk"
};
config.compilerWasm = {
  getRuntime: async () => await import("./assets/query_compiler_fast_bg-gBoRaSMa.js"),
  getQueryCompilerWasmModule: async () => {
    const { default: module } = await import("../../app/db/internal/query_compiler_fast_bg.wasm?module");
    return module;
  },
  importName: "./query_compiler_fast_bg.js"
};
if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
  runtime.Debug.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
runtime.Extensions.getExtensionContext;
({
  DbNull: runtime.NullTypes.DbNull,
  JsonNull: runtime.NullTypes.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull
});
runtime.makeStrictEnum({
  Serializable: "Serializable"
});
runtime.Extensions.defineExtension;
globalThis["__dirname"] = "/";
const PrismaClient = getPrismaClientClass();
let cachedPrisma = null;
let cachedD1 = null;
function getPrisma(context) {
  if (!context?.cloudflare?.env?.D1_DATABASE) {
    throw new Error(
      "getPrisma: D1_DATABASE binding not found. Run via `wrangler dev` or check your Cloudflare environment."
    );
  }
  const d1 = context.cloudflare.env.D1_DATABASE;
  if (cachedPrisma && cachedD1 === d1) {
    return cachedPrisma;
  }
  const adapter = new PrismaD1(d1);
  cachedPrisma = new PrismaClient({ adapter });
  cachedD1 = d1;
  return cachedPrisma;
}
function BtnSecondary({
  children,
  className = "",
  ...rest
}) {
  return /* @__PURE__ */ jsx("button", { className: `td-btn-secondary ${className}`, ...rest, children });
}
function Plaque({ children, className = "", style }) {
  return /* @__PURE__ */ jsx("div", { className: `td-plaque ${className}`, style, children });
}
function Pin({ size = 20, color = "#c8372a", className = "" }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 20 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "10", cy: "8", r: "7", fill: color }),
        /* @__PURE__ */ jsx("circle", { cx: "8", cy: "6", r: "2", fill: "rgba(255,255,255,0.35)" }),
        /* @__PURE__ */ jsx("line", { x1: "10", y1: "15", x2: "10", y2: "24", stroke: color, strokeWidth: "2", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx("circle", { cx: "10", cy: "8", r: "7", stroke: "rgba(0,0,0,0.2)", strokeWidth: "1", fill: "none" })
      ]
    }
  );
}
function Strike({
  width = 80,
  height = 4,
  color = "rgba(200,55,42,0.7)",
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width,
      height: height + 4,
      viewBox: `0 0 ${width} ${height + 4}`,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: `M2 ${(height + 4) / 2 + 1} Q${width * 0.25} ${(height + 4) / 2 - 2} ${width * 0.5} ${(height + 4) / 2 + 1} Q${width * 0.75} ${(height + 4) / 2 + 3} ${width - 2} ${(height + 4) / 2}`,
          stroke: color,
          strokeWidth: height,
          strokeLinecap: "round",
          fill: "none"
        }
      )
    }
  );
}
function TrashIcon({
  className = "",
  size = 13
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className,
      children: [
        /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
        /* @__PURE__ */ jsx("path", { d: "M19 6l-1 14H6L5 6" }),
        /* @__PURE__ */ jsx("path", { d: "M10 11v6" }),
        /* @__PURE__ */ jsx("path", { d: "M14 11v6" }),
        /* @__PURE__ */ jsx("path", { d: "M9 6V4h6v2" })
      ]
    }
  );
}
function LinkIcon({
  className = "",
  size = 16
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
        /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
      ]
    }
  );
}
function PencilIcon({
  className = "",
  size = 16
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" }),
        /* @__PURE__ */ jsx("line", { x1: "15", y1: "5", x2: "19", y2: "9" })
      ]
    }
  );
}
function PlusIcon({
  className = "",
  size = 16
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className,
      children: [
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
        /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
      ]
    }
  );
}
function CloseIcon({
  className = "",
  size = 16
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      "aria-hidden": "true",
      className,
      children: [
        /* @__PURE__ */ jsx("line", { x1: "3", y1: "3", x2: "13", y2: "13" }),
        /* @__PURE__ */ jsx("line", { x1: "13", y1: "3", x2: "3", y2: "13" })
      ]
    }
  );
}
function meta({
  data: loaderData
}) {
  const hostName = loaderData?.hostName || "Host";
  return [{
    title: `The Game of Things — ${hostName}'s table`
  }];
}
const PIN_ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -1.8, 1.2, -2.2, 2, -0.8, 1.5];
async function loader({
  params,
  request,
  context
}) {
  const {
    gameId
  } = params;
  const db = getPrisma(context);
  const game = await db.game.findUnique({
    where: {
      id: gameId
    }
  });
  if (!game) throw data({
    error: "Game not found"
  }, {
    status: 404
  });
  const identity = readGuestCookie(request, `got_${gameId}`);
  const isHost = identity?.seat === 0;
  const myName = identity?.name ?? "Spectator";
  const env = context.cloudflare?.env;
  let initialState = null;
  if (env) {
    try {
      const doId = env.GOT_ROOM.idFromName(gameId);
      const stub = env.GOT_ROOM.get(doId);
      const res = await stub.fetch(new Request("http://internal/state"));
      if (res.ok) {
        const body = await res.json();
        initialState = body.state;
      }
    } catch {
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
    shareUrl
  };
}
const game_$gameId = UNSAFE_withComponentProps(function GameRoom({
  loaderData
}) {
  const {
    gameId,
    hostName,
    isHost,
    myName,
    mySeat,
    initialState,
    shareUrl
  } = loaderData;
  const [gotState, setGotState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const {
    send
  } = useGameWebSocket({
    gameId,
    seat: mySeat,
    name: myName,
    onMessage: useCallback((rawMsg) => {
      const msg = rawMsg;
      if (msg.type === "state_updated") {
        setGotState(msg.state);
      } else if (msg.type === "game_state") {
        const s = msg.state;
        if (s) setGotState(s);
      }
    }, [])
  });
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
    }
  };
  const topic = gotState?.topic ?? "";
  const players = gotState?.players ?? [];
  const notes = gotState?.notes ?? "";
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      padding: "clamp(16px, 4vw, 40px) clamp(16px, 5vw, 48px)"
    },
    children: [/* @__PURE__ */ jsxs("header", {
      className: "w-full",
      style: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 32,
        paddingLeft: 2,
        paddingRight: 2
      },
      children: [/* @__PURE__ */ jsx(Plaque, {
        style: {
          padding: "16px 28px"
        },
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              display: "block",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--ink)",
              fontSize: "clamp(20px, 3.5vw, 34px)",
              lineHeight: 1,
              letterSpacing: "0.02em"
            },
            children: "The Game of Things"
          }), /* @__PURE__ */ jsxs("span", {
            style: {
              display: "block",
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              fontSize: "10.5px",
              letterSpacing: "0.32em",
              color: "rgba(42,31,22,0.5)",
              marginTop: 4
            },
            children: ["Hosted by ", hostName]
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center"
        },
        children: isHost ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: copyLink,
            className: "td-ticket-bone",
            type: "button",
            "aria-label": "Copy share link",
            children: [/* @__PURE__ */ jsx(LinkIcon, {
              size: 13
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.18em",
                fontSize: 12
              },
              children: "Share Link"
            })]
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setResetModalOpen(true),
            className: "td-ticket-bone",
            type: "button",
            "aria-label": "Reset round",
            children: /* @__PURE__ */ jsx("span", {
              style: {
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.18em",
                fontSize: 12
              },
              children: "Reset Round"
            })
          })]
        }) : (
          /* VIEWING chip — non-interactive */
          /* @__PURE__ */ jsx("div", {
            className: "td-ticket",
            style: {
              cursor: "default"
            },
            children: /* @__PURE__ */ jsx("span", {
              style: {
                fontFamily: "var(--serif)",
                fontVariant: "small-caps",
                letterSpacing: "0.2em",
                fontSize: 11,
                color: "rgba(42,31,22,0.6)"
              },
              children: "Viewing"
            })
          })
        )
      })]
    }), /* @__PURE__ */ jsx(PromptCard, {
      topic,
      isHost,
      onSetTopic: (t) => send({
        type: "set_topic",
        topic: t
      })
    }), isHost && /* @__PURE__ */ jsx("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 8
      },
      children: /* @__PURE__ */ jsx(AddPlayerForm, {
        onAdd: (name) => send({
          type: "add_player",
          name
        })
      })
    }), /* @__PURE__ */ jsx(PlayerBoard, {
      players,
      isHost,
      onToggle: (name) => send({
        type: "toggle_player",
        name
      }),
      onRemove: (name) => send({
        type: "remove_player",
        name
      }),
      onScore: (name, delta) => send({
        type: "increment_score",
        name,
        delta
      })
    }), /* @__PURE__ */ jsx(Scoreboard, {
      players,
      isHost,
      onResetScores: () => send({
        type: "reset_scores"
      })
    }), /* @__PURE__ */ jsx(NotesSection, {
      notes,
      isHost,
      onSetNotes: (n) => send({
        type: "set_notes",
        notes: n
      })
    }), /* @__PURE__ */ jsx("footer", {
      style: {
        marginTop: 48,
        textAlign: "center",
        fontFamily: "var(--serif)",
        fontVariant: "small-caps",
        fontSize: "10.5px",
        letterSpacing: "0.28em",
        color: "rgba(42,31,22,0.35)",
        borderTop: "1px solid rgba(42,31,22,0.12)",
        paddingTop: 14
      },
      children: "Tabledeck · The Game of Things · 2026 · Made for the Table"
    }), copied && /* @__PURE__ */ jsx("div", {
      className: "td-toast-stamp",
      children: "Copied"
    }), resetModalOpen && /* @__PURE__ */ jsx(ResetModal, {
      onCancel: () => setResetModalOpen(false),
      onConfirm: () => {
        send({
          type: "reset_round"
        });
        setResetModalOpen(false);
      }
    })]
  });
});
function PromptCard({
  topic,
  isHost,
  onSetTopic
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(topic);
  const textareaRef = useRef(null);
  useEffect(() => {
    if (!editing) setDraft(topic);
  }, [topic, editing]);
  const commitEdit = () => {
    setEditing(false);
    if (draft.trim() !== topic) {
      onSetTopic(draft.trim());
    }
  };
  return /* @__PURE__ */ jsx("section", {
    style: {
      width: "100%",
      maxWidth: 540,
      margin: "0 auto 32px"
    },
    children: /* @__PURE__ */ jsxs("div", {
      className: "td-card",
      style: {
        background: "#fdf8f0",
        padding: "28px 28px 22px",
        borderRadius: "9px"
      },
      children: [/* @__PURE__ */ jsx("div", {
        "aria-hidden": "true",
        style: {
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
          transform: "rotate(-10deg)"
        },
        children: /* @__PURE__ */ jsx("svg", {
          width: "28",
          height: "28",
          viewBox: "0 0 28 28",
          fill: "none",
          children: /* @__PURE__ */ jsx("text", {
            x: "14",
            y: "18",
            textAnchor: "middle",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontVariant: "small-caps",
            fontWeight: "700",
            fontSize: "9",
            letterSpacing: "0.5",
            fill: "#2a1f16",
            opacity: "0.85",
            children: "THINGS"
          })
        })
      }), isHost && editing ? /* @__PURE__ */ jsx("textarea", {
        ref: textareaRef,
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onBlur: commitEdit,
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commitEdit();
          }
          if (e.key === "Escape") {
            setDraft(topic);
            setEditing(false);
          }
        },
        autoFocus: true,
        rows: 2,
        placeholder: "Click to set a prompt…",
        style: {
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
          position: "relative"
        }
      }) : /* @__PURE__ */ jsxs("div", {
        style: {
          position: "relative",
          zIndex: 1
        },
        children: [/* @__PURE__ */ jsx("p", {
          className: "font-serif italic",
          style: {
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            color: "var(--ink)",
            fontSize: "clamp(17px, 2.5vw, 24px)",
            lineHeight: 1.35,
            letterSpacing: "0.01em",
            margin: 0,
            cursor: isHost ? "pointer" : "default",
            minHeight: 32
          },
          onClick: isHost ? () => setEditing(true) : void 0,
          title: isHost ? "Click to edit prompt" : void 0,
          children: topic || /* @__PURE__ */ jsx("span", {
            style: {
              color: "rgba(42,31,22,0.35)",
              fontStyle: "italic"
            },
            children: isHost ? "Click to set a prompt…" : "No prompt set yet"
          })
        }), isHost && topic && /* @__PURE__ */ jsx("button", {
          onClick: () => setEditing(true),
          "aria-label": "Edit prompt",
          style: {
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
            zIndex: 2
          },
          onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
          onMouseLeave: (e) => e.currentTarget.style.opacity = "0",
          children: /* @__PURE__ */ jsx(PencilIcon, {
            size: 14
          })
        })]
      }), !topic.trim() && !draft.trim() && /* @__PURE__ */ jsx("p", {
        style: {
          fontFamily: "var(--script)",
          fontSize: "17px",
          color: "rgba(42,31,22,0.5)",
          marginTop: 12,
          marginBottom: 0,
          position: "relative",
          zIndex: 1
        },
        children: "e.g. — what you would regret the moment it leaves your mouth"
      }), /* @__PURE__ */ jsx("div", {
        "aria-hidden": "true",
        style: {
          position: "relative",
          marginTop: 20,
          height: "3px",
          background: "repeating-linear-gradient(90deg, var(--cocktail) 0 6px, transparent 6px 10px)",
          opacity: 0.4,
          borderRadius: "2px",
          zIndex: 1
        }
      })]
    })
  });
}
function PlayerBoard({
  players,
  isHost,
  onToggle,
  onRemove,
  onScore
}) {
  if (!players || players.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        textAlign: "center",
        paddingTop: 40,
        paddingBottom: 40
      },
      children: /* @__PURE__ */ jsx("p", {
        style: {
          fontFamily: "var(--script)",
          fontSize: "20px",
          color: "rgba(42,31,22,0.4)",
          margin: 0
        },
        children: isHost ? "No players yet — add some names above" : "No players yet — host hasn't seated anyone yet"
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(116px, 1fr))",
      gap: 24,
      justifyItems: "center",
      maxWidth: 860,
      margin: "0 auto",
      width: "100%"
    },
    children: players.map((player, i) => /* @__PURE__ */ jsx(PlayerCard, {
      name: player.name,
      isOut: player.isOut,
      score: player.score ?? 0,
      rotIndex: i,
      isHost,
      onToggle: () => onToggle(player.name),
      onRemove: () => onRemove(player.name),
      onScore: () => onScore(player.name, 1)
    }, player.name))
  });
}
function PlayerCard({
  name,
  isOut,
  score,
  rotIndex,
  isHost,
  onToggle,
  onRemove,
  onScore
}) {
  const rot = PIN_ROTATIONS[rotIndex % PIN_ROTATIONS.length];
  const cardProps = isHost ? {
    role: "button",
    tabIndex: 0,
    "aria-pressed": isOut,
    "aria-label": `${name} — ${isOut ? "out" : "in"}. Click to toggle.`,
    onClick: onToggle,
    onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onToggle()
  } : {
    "aria-label": `${name} — ${isOut ? "out" : "in"}`
  };
  return /* @__PURE__ */ jsxs("div", {
    className: `td-pinned${isOut ? " is-out" : ""}${!isHost ? " viewer-mode" : ""}`,
    style: {
      "--pin-rot": `${rot}deg`
    },
    ...cardProps,
    children: [/* @__PURE__ */ jsx("div", {
      style: {
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
        pointerEvents: "none"
      },
      children: /* @__PURE__ */ jsx(Pin, {
        size: 22,
        color: isOut ? "#888" : "#c8372a"
      })
    }), !isOut && /* @__PURE__ */ jsx("div", {
      "aria-hidden": "true",
      style: {
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
        transform: "rotate(-8deg)"
      },
      children: /* @__PURE__ */ jsx("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        fill: "none",
        children: /* @__PURE__ */ jsx("text", {
          x: "8",
          y: "11.5",
          textAnchor: "middle",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: "700",
          fontSize: "8",
          letterSpacing: "0.3",
          fill: "rgba(255,255,255,0.9)",
          children: "IN"
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      style: {
        fontFamily: "var(--serif)",
        fontWeight: 600,
        fontSize: "19px",
        textAlign: "center",
        lineHeight: 1.2,
        color: "var(--ink)",
        position: "relative",
        zIndex: 1
      },
      children: name
    }), isOut && /* @__PURE__ */ jsx("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
        position: "relative",
        zIndex: 1
      },
      children: /* @__PURE__ */ jsx(Strike, {
        width: name.length * 8 + 16,
        height: 3,
        color: "rgba(200,55,42,0.65)"
      })
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
        position: "relative",
        zIndex: 1
      },
      children: [/* @__PURE__ */ jsxs("span", {
        "aria-label": `${name} has ${score} point${score === 1 ? "" : "s"}`,
        style: {
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          letterSpacing: "0.12em",
          fontSize: 11,
          color: "rgba(42,31,22,0.6)"
        },
        children: [score, " pt", score === 1 ? "" : "s"]
      }), isHost && /* @__PURE__ */ jsx("button", {
        type: "button",
        "aria-label": `Award a point to ${name}`,
        title: "Guessed correctly — +1 point",
        onClick: (e) => {
          e.stopPropagation();
          onScore();
        },
        style: {
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
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "#f3e6c8";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "#fdf8f0";
        },
        children: "+1"
      })]
    }), isHost && /* @__PURE__ */ jsx("button", {
      className: "absolute bottom-2 right-2 transition-opacity",
      style: {
        position: "absolute",
        bottom: 8,
        right: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(42,31,22,0.3)",
        padding: "2px",
        zIndex: 2,
        lineHeight: 1
      },
      "aria-label": `Remove ${name}`,
      onClick: (e) => {
        e.stopPropagation();
        onRemove();
      },
      onMouseEnter: (e) => e.currentTarget.style.color = "#c8372a",
      onMouseLeave: (e) => e.currentTarget.style.color = "rgba(42,31,22,0.3)",
      type: "button",
      children: /* @__PURE__ */ jsx(TrashIcon, {
        size: 13
      })
    })]
  });
}
function Scoreboard({
  players,
  isHost,
  onResetScores
}) {
  const [open, setOpen] = useState(true);
  if (!players || players.length === 0) return null;
  const ranked = [...players].sort((a, b) => {
    const s = (b.score ?? 0) - (a.score ?? 0);
    return s !== 0 ? s : a.name.localeCompare(b.name);
  });
  return /* @__PURE__ */ jsx("section", {
    style: {
      width: "100%",
      maxWidth: 640,
      margin: "32px auto 0"
    },
    children: /* @__PURE__ */ jsxs("div", {
      className: "td-card",
      style: {
        background: "#fdf8f0",
        padding: "14px 20px",
        borderRadius: 9
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "relative",
          zIndex: 1
        },
        children: [/* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => setOpen((o) => !o),
          "aria-expanded": open,
          "aria-controls": "got-scoreboard-body",
          style: {
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
            color: "var(--ink)"
          },
          children: [/* @__PURE__ */ jsx("span", {
            "aria-hidden": "true",
            style: {
              fontSize: 10,
              opacity: 0.5
            },
            children: open ? "▾" : "▸"
          }), "Scoreboard"]
        }), /* @__PURE__ */ jsx("div", {
          "aria-hidden": "true",
          style: {
            flex: 1,
            height: 1,
            background: "repeating-linear-gradient(90deg, rgba(42,31,22,0.3) 0 4px, transparent 4px 8px)"
          }
        }), isHost && open && /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: onResetScores,
          style: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--serif)",
            fontVariant: "small-caps",
            letterSpacing: "0.18em",
            fontSize: 11,
            color: "rgba(42,31,22,0.55)",
            padding: "2px 4px"
          },
          title: "Reset all scores to zero",
          children: "Reset"
        })]
      }), open && /* @__PURE__ */ jsx("ul", {
        id: "got-scoreboard-body",
        style: {
          listStyle: "none",
          margin: "10px 0 0",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "6px 18px",
          position: "relative",
          zIndex: 1
        },
        children: ranked.map((p) => /* @__PURE__ */ jsxs("li", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 8,
            fontFamily: "var(--serif)",
            fontSize: 15,
            color: "var(--ink)",
            borderBottom: "1px dotted rgba(42,31,22,0.2)",
            padding: "2px 0"
          },
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis"
            },
            children: p.name
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontWeight: 700,
              fontVariant: "tabular-nums",
              color: "var(--ink)"
            },
            children: p.score ?? 0
          })]
        }, p.name))
      })]
    })
  });
}
function AddPlayerForm({
  onAdd
}) {
  const [newName, setNewName] = useState("");
  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 12,
      marginBottom: 32
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4
      },
      children: [/* @__PURE__ */ jsx("label", {
        className: "sc",
        htmlFor: "add-player-input",
        style: {
          fontFamily: "var(--serif)",
          fontVariant: "small-caps",
          fontSize: "10.5px",
          letterSpacing: "0.2em",
          color: "rgba(42,31,22,0.55)"
        },
        children: "Add Player"
      }), /* @__PURE__ */ jsx("input", {
        id: "add-player-input",
        type: "text",
        placeholder: "a name...",
        value: newName,
        onChange: (e) => setNewName(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && handleAdd(),
        className: "td-input",
        style: {
          width: "180px"
        },
        maxLength: 24
      })]
    }), /* @__PURE__ */ jsxs(BtnPrimary, {
      onClick: handleAdd,
      type: "button",
      style: {
        paddingTop: "8px",
        paddingBottom: "8px"
      },
      children: [/* @__PURE__ */ jsx(PlusIcon, {
        size: 14
      }), "Add"]
    })]
  });
}
function NotesSection({
  notes,
  isHost,
  onSetNotes
}) {
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);
  const [localNotes, setLocalNotes] = useState(notes);
  const isEditingRef = useRef(false);
  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalNotes(notes);
    }
  }, [notes]);
  const handleChange = (e) => {
    const val = e.target.value;
    setLocalNotes(val);
    isEditingRef.current = true;
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSetNotes(val);
      isEditingRef.current = false;
    }, 250);
  };
  return /* @__PURE__ */ jsx("section", {
    style: {
      width: "100%",
      maxWidth: 640,
      margin: "32px auto 0"
    },
    children: /* @__PURE__ */ jsxs("div", {
      className: "td-scroll",
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(42,31,22,0.15)"
        },
        children: [/* @__PURE__ */ jsx("h2", {
          style: {
            fontFamily: "var(--serif)",
            fontVariant: "small-caps",
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "0.14em",
            color: "var(--ink)",
            margin: 0
          },
          children: "Round Notes"
        }), /* @__PURE__ */ jsx("div", {
          "aria-hidden": "true",
          style: {
            flex: 1,
            height: "1px",
            background: "repeating-linear-gradient(90deg, rgba(42,31,22,0.3) 0 4px, transparent 4px 8px)"
          }
        }), /* @__PURE__ */ jsx("span", {
          style: {
            fontFamily: "var(--script)",
            fontSize: "16px",
            color: "rgba(42,31,22,0.4)"
          },
          children: "who said what"
        })]
      }), isHost ? /* @__PURE__ */ jsx("textarea", {
        ref: textareaRef,
        className: "td-notebook",
        placeholder: "jot it down...",
        value: localNotes,
        onChange: handleChange,
        onInput: (e) => {
          const t = e.currentTarget;
          t.style.height = "auto";
          t.style.height = t.scrollHeight + "px";
        },
        rows: 4
      }) : /* @__PURE__ */ jsx("div", {
        className: "td-notebook-readonly",
        children: localNotes || /* @__PURE__ */ jsx("span", {
          style: {
            fontFamily: "var(--script)",
            fontSize: 16,
            color: "rgba(42,31,22,0.35)",
            fontStyle: "italic"
          },
          children: "(host hasn't written any notes yet)"
        })
      })]
    })
  });
}
function ResetModal({
  onCancel,
  onConfirm
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "modal-scroll-overlay",
    children: /* @__PURE__ */ jsx("div", {
      className: "modal-scroll",
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          position: "relative",
          zIndex: 1
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12
          },
          children: [/* @__PURE__ */ jsx("h3", {
            style: {
              fontFamily: "var(--serif)",
              fontVariant: "small-caps",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: "0.14em",
              color: "var(--ink)",
              margin: 0
            },
            children: "Reset the Round?"
          }), /* @__PURE__ */ jsx("button", {
            onClick: onCancel,
            type: "button",
            "aria-label": "Cancel",
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(42,31,22,0.45)",
              padding: 2,
              marginTop: 2
            },
            children: /* @__PURE__ */ jsx(CloseIcon, {
              size: 16
            })
          })]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 16,
            color: "var(--ink-soft)",
            margin: "0 0 6px",
            lineHeight: 1.5
          },
          children: "All players will be flipped back to IN. Your notes and topic stay."
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontFamily: "var(--script)",
            fontSize: 17,
            color: "rgba(42,31,22,0.45)",
            margin: "0 0 20px"
          },
          children: "fresh prompt, fresh start"
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 10,
            justifyContent: "flex-end"
          },
          children: [/* @__PURE__ */ jsx(BtnSecondary, {
            onClick: onCancel,
            type: "button",
            children: "Cancel"
          }), /* @__PURE__ */ jsx(BtnPrimary, {
            onClick: onConfirm,
            type: "button",
            children: "Reset"
          })]
        })]
      })
    })
  });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: game_$gameId,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const CreateGameSchema = z.object({
  hostName: z.string().min(1).max(24),
  topic: z.string().max(280).default("")
});
async function action({
  request,
  context
}) {
  if (request.method !== "POST") {
    throw data({
      error: "Method not allowed"
    }, {
      status: 405
    });
  }
  const body = await request.json();
  const parsed = CreateGameSchema.safeParse(body);
  if (!parsed.success) {
    throw data({
      error: "Invalid request",
      details: parsed.error.flatten()
    }, {
      status: 400
    });
  }
  const {
    hostName,
    topic
  } = parsed.data;
  const gameId = nanoid(6);
  const db = getPrisma(context);
  await db.game.create({
    data: {
      id: gameId,
      hostName,
      topic
    }
  });
  const env = context.cloudflare.env;
  const doId = env.GOT_ROOM.idFromName(gameId);
  const stub = env.GOT_ROOM.get(doId);
  await stub.fetch(new Request("http://internal/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gameId,
      settings: {
        maxPlayers: 1,
        hostName,
        topic
      }
    })
  }));
  const hostCookie = makeGuestCookieHeader(`got_${gameId}`, 0, hostName);
  return data({
    gameId
  }, {
    headers: {
      "Set-Cookie": hostCookie
    }
  });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BRexs9Iv.js", "imports": ["/assets/chunk-OE4NN4TA-DLHXbJDI.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-89PfXlD2.js", "imports": ["/assets/chunk-OE4NN4TA-DLHXbJDI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/_index-CGHxBkXt.js", "imports": ["/assets/chunk-OE4NN4TA-DLHXbJDI.js", "/assets/BtnPrimary-Bf5_CY6N.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/game.$gameId": { "id": "routes/game.$gameId", "parentId": "root", "path": "game/:gameId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/game._gameId-EBRkhHJ4.js", "imports": ["/assets/chunk-OE4NN4TA-DLHXbJDI.js", "/assets/BtnPrimary-Bf5_CY6N.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/game": { "id": "routes/api/game", "parentId": "root", "path": "api/game", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": false, "hasErrorBoundary": false, "module": "/assets/game-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-708ed15d.js", "version": "708ed15d", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_passThroughRequests": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/game.$gameId": {
    id: "routes/game.$gameId",
    parentId: "root",
    path: "game/:gameId",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api/game": {
    id: "routes/api/game",
    parentId: "root",
    path: "api/game",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};

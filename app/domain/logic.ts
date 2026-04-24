import type { GotState } from "./types";

export function setTopic(state: GotState, topic: string): GotState {
  return { ...state, topic };
}

export function addPlayer(state: GotState, name: string): GotState {
  const trimmed = name.trim();
  if (!trimmed) return state;
  if (state.players.some((p) => p.name === trimmed)) return state;
  return {
    ...state,
    players: [...state.players, { name: trimmed, isOut: false, score: 0 }],
  };
}

export function removePlayer(state: GotState, name: string): GotState {
  return { ...state, players: state.players.filter((p) => p.name !== name) };
}

export function togglePlayer(state: GotState, name: string): GotState {
  return {
    ...state,
    players: state.players.map((p) => (p.name === name ? { ...p, isOut: !p.isOut } : p)),
  };
}

export function setNotes(state: GotState, notes: string): GotState {
  return { ...state, notes };
}

export function resetRound(state: GotState): GotState {
  return { ...state, players: state.players.map((p) => ({ ...p, isOut: false })) };
}

export function incrementScore(
  state: GotState,
  name: string,
  delta: number,
): GotState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.name === name ? { ...p, score: Math.max(0, (p.score ?? 0) + delta) } : p,
    ),
  };
}

export function resetScores(state: GotState): GotState {
  return {
    ...state,
    players: state.players.map((p) => ({ ...p, score: 0 })),
  };
}

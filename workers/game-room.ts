import { BaseGameRoomDO } from "@tabledeck/game-room/server";
import type { GotState, GotSettings } from "../app/domain/types";
import { ClientMessage } from "../app/domain/messages";
import {
  setTopic,
  addPlayer,
  removePlayer,
  togglePlayer,
  setNotes,
  resetRound,
} from "../app/domain/logic";

export class GotRoomDO extends BaseGameRoomDO<GotState, GotSettings, Env> {
  // ── Required: initialize fresh state ──────────────────────────────────────

  protected initializeState(settings: GotSettings): GotState {
    return {
      topic: settings.topic,
      players: [], // host starts empty — they'll add via UI
      notes: "",
      host: { seat: 0, name: settings.hostName || "Host", connected: false },
    };
  }

  // ── Required: serialize / deserialize ─────────────────────────────────────

  protected serializeState(state: GotState): Record<string, unknown> {
    return {
      topic: state.topic,
      players: state.players,
      notes: state.notes,
      host: state.host,
    };
  }

  protected deserializeState(data: Record<string, unknown>): GotState {
    const raw = data as GotState;
    return {
      topic: raw.topic ?? "",
      players: raw.players ?? [],
      notes: raw.notes ?? "",
      host: raw.host ?? { seat: 0, name: "Host", connected: false },
    };
  }

  // ── Required: player seat queries ─────────────────────────────────────────

  protected isPlayerSeated(_state: GotState, seat: number): boolean {
    return seat === 0;
  }

  protected getPlayerName(state: GotState, seat: number): string | null {
    return seat === 0 ? state.host.name : null;
  }

  protected seatPlayer(state: GotState, seat: number, name: string): GotState {
    if (seat === 0) {
      return { ...state, host: { seat: 0, name, connected: true } };
    }
    // Viewers (seat -1) don't actually seat
    return state;
  }

  protected getSeatedCount(state: GotState): number {
    return state.host.connected ? 1 : 0;
  }

  // ── Required: game start ──────────────────────────────────────────────────

  protected async onAllPlayersSeated(): Promise<void> {
    // No-op: game is always in "playing" state.
  }

  // ── Required: route game messages ─────────────────────────────────────────

  protected async onGameMessage(
    ws: WebSocket,
    rawMsg: unknown,
    seat: number,
  ): Promise<void> {
    if (!this.gameState || !this.settings) return;

    // Only the host (seat 0) may mutate state
    if (seat !== 0) {
      ws.send(JSON.stringify({ type: "error", message: "Only the host can change game state." }));
      return;
    }

    const result = ClientMessage.safeParse(rawMsg);
    if (!result.success) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid message." }));
      return;
    }

    const msg = result.data;

    switch (msg.type) {
      case "set_topic": {
        this.gameState = setTopic(this.gameState, msg.topic);
        break;
      }
      case "add_player": {
        this.gameState = addPlayer(this.gameState, msg.name);
        break;
      }
      case "remove_player": {
        this.gameState = removePlayer(this.gameState, msg.name);
        break;
      }
      case "toggle_player": {
        this.gameState = togglePlayer(this.gameState, msg.name);
        break;
      }
      case "set_notes": {
        this.gameState = setNotes(this.gameState, msg.notes);
        break;
      }
      case "reset_round": {
        this.gameState = resetRound(this.gameState);
        break;
      }
    }

    await this.persistState();
    this.broadcast(
      JSON.stringify({ type: "state_updated", state: this.gameState }),
    );
  }

  // ── Optional: track disconnect ─────────────────────────────────────────────

  protected onPlayerDisconnected(seat: number): void {
    if (seat === 0 && this.gameState) {
      this.gameState = {
        ...this.gameState,
        host: { ...this.gameState.host, connected: false },
      };
    }
  }
}

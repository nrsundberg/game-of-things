import type { BaseSettings } from "@tabledeck/game-room/server";

export interface GotSettings extends BaseSettings {
  hostName: string; // cosmetic only, shown in the viewer tag
  topic: string;    // free text, can be blank at create time
  // maxPlayers is inherited from BaseSettings. Set to 1 at create — only the host seats.
}

export interface GotPlayer {
  name: string;
  isOut: boolean;
}

export interface GotHostSeat {
  seat: 0;
  name: string;
  connected: boolean;
}

export interface GotState {
  topic: string;
  players: GotPlayer[];
  notes: string;
  host: GotHostSeat;
}

import { z } from "zod";

export const SetTopicMsg = z.object({
  type: z.literal("set_topic"),
  topic: z.string().max(280),
});

export const AddPlayerMsg = z.object({
  type: z.literal("add_player"),
  name: z.string().min(1).max(24),
});

export const RemovePlayerMsg = z.object({
  type: z.literal("remove_player"),
  name: z.string().min(1).max(24),
});

export const TogglePlayerMsg = z.object({
  type: z.literal("toggle_player"),
  name: z.string().min(1).max(24),
});

export const SetNotesMsg = z.object({
  type: z.literal("set_notes"),
  notes: z.string().max(10_000),
});

export const ResetRoundMsg = z.object({
  // Resets all isOut → false. Useful when starting a new prompt.
  type: z.literal("reset_round"),
});

export const IncrementScoreMsg = z.object({
  // Add +delta (can be negative) to a player's running score.
  type: z.literal("increment_score"),
  name: z.string().min(1).max(24),
  delta: z.number().int().min(-10).max(10).default(1),
});

export const ResetScoresMsg = z.object({
  type: z.literal("reset_scores"),
});

export const ClientMessage = z.discriminatedUnion("type", [
  SetTopicMsg,
  AddPlayerMsg,
  RemovePlayerMsg,
  TogglePlayerMsg,
  SetNotesMsg,
  ResetRoundMsg,
  IncrementScoreMsg,
  ResetScoresMsg,
]);

export type ClientMessage = z.infer<typeof ClientMessage>;

// Server → client broadcasts always send the full state after a mutation.
// Reuse the StateSyncedMsg pattern from @tabledeck/game-room so the client just
// patches the whole GotState on receive. (Matches the scoreboard pattern:
// it sends granular deltas, but GOT state is small enough to resync fully.)
export interface StateUpdatedMsg {
  type: "state_updated";
  state: import("./types").GotState;
}

export type ServerMessage = StateUpdatedMsg;

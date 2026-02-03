/**
 * Event schema definitions.
 * Pure structural typing, no logic.
 */

export type EventType =
  | "build_started"
  | "build_completed"
  | "content_published"
  | "artifact_served"
  | "error";

export type Event = {
  type: EventType;
  timestamp: string;
  payload?: Record<string, unknown>;
};

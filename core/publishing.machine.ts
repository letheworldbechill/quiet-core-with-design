/**
 * Publishing state machine.
 *
 * This file defines the complete and exclusive lifecycle
 * of SiteContent within the system.
 *
 * - No side effects
 * - No persistence
 * - No UI knowledge
 * - No implicit transitions
 *
 * If a transition is not defined here, it is forbidden.
 */

import { ContentState } from "./types";

/* ---------------------------------------------
 * State transition map
 * --------------------------------------------- */

const ALLOWED_TRANSITIONS: Record<ContentState, ContentState[]> = {
  draft: ["review"],
  review: ["draft", "published"],
  published: ["archived"],
  archived: [],
};

/* ---------------------------------------------
 * Queries
 * --------------------------------------------- */

/**
 * Returns all allowed target states for a given source state.
 */
export function getAllowedTransitions(
  from: ContentState
): ContentState[] {
  return [...ALLOWED_TRANSITIONS[from]];
}

/**
 * Returns true if the transition from -> to is allowed.
 */
export function canTransition(
  from: ContentState,
  to: ContentState
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/* ---------------------------------------------
 * Commands
 * --------------------------------------------- */

/**
 * Performs a state transition.
 * Throws if the transition is not allowed.
 */
export function transitionState(
  from: ContentState,
  to: ContentState
): ContentState {
  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid content state transition: ${from} → ${to}`
    );
  }
  return to;
}

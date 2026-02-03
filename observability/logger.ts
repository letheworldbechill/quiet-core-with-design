/**
 * Logger interface.
 * No implementation, no side effects.
 */

import { Event } from "./events.schema";

export interface Logger {
  log(event: Event): void;
}

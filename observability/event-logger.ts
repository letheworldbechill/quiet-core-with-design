/**
 * Event logger adapter.
 * Delegates logging to an injected logger.
 */

import { Event } from "./events.schema";
import { Logger } from "./logger";

export function logEvent(logger: Logger, event: Event): void {
  logger.log(event);
}

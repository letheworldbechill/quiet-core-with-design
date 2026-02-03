/**
 * Builder core access.
 *
 * This is the ONLY allowed import source for core functionality.
 * All builder files must import from this module, not from "../core" directly.
 *
 * This prevents accidental boundary violations.
 */

export * from "../core";

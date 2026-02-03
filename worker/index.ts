/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker entry.
 *
 * Responsibilities:
 * - Route requests
 * - Resolve shortlinks
 * - Forward to static artifacts
 * - Emit observability events
 *
 * Forbidden:
 * - Content rendering
 * - State mutation
 * - Persistence
 * - Business logic
 */

import { resolveShortlink, Shortlink } from "../distribution";

import { logEvent, Event } from "../observability";

/* ---------------------------------------------
 * Environment bindings
 * --------------------------------------------- */

export interface WorkerEnv {
  SHORTLINKS: Shortlink[];
  LOGGER: {
    log: (event: Event) => void;
  };
}

/* ---------------------------------------------
 * Request handling
 * --------------------------------------------- */

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Shortlink routing: /s/{key}
    if (url.pathname.startsWith("/s/")) {
      const key = url.pathname.replace("/s/", "");
      const target = resolveShortlink(env.SHORTLINKS, key);

      if (target) {
        ctx.waitUntil(
          Promise.resolve().then(() =>
            logEvent(env.LOGGER, {
              type: "artifact_served",
              timestamp: new Date().toISOString(),
              payload: { key, target },
            })
          )
        );

        return Response.redirect(target, 302);
      }

      return new Response("Not Found", { status: 404 });
    }

    // Fallback: pass through to static assets
    return fetch(request);
  },
};

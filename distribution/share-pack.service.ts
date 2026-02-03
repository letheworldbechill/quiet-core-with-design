/**
 * Share pack aggregation.
 * Combines multiple share representations.
 */

import { OpenGraphMeta } from "./og.generator";
import { WhatsappPayload } from "./whatsapp.generator";
import { QrPayload } from "./qr.generator";

export type SharePack = {
  openGraph: OpenGraphMeta;
  whatsapp: WhatsappPayload;
  qr: QrPayload;
};

export function createSharePack(input: {
  openGraph: OpenGraphMeta;
  whatsapp: WhatsappPayload;
  qr: QrPayload;
}): SharePack {
  return {
    openGraph: input.openGraph,
    whatsapp: input.whatsapp,
    qr: input.qr,
  };
}

/**
 * QR code payload generator.
 * Returns a string payload for QR encoding.
 */

export type QrPayload = {
  url: string;
};

export function generateQrPayload(url: string): QrPayload {
  return { url };
}

/**
 * WhatsApp share payload generator.
 */

export type WhatsappPayload = {
  text: string;
};

export function generateWhatsappPayload(
  message: string,
  url: string
): WhatsappPayload {
  return {
    text: `${message} ${url}`,
  };
}

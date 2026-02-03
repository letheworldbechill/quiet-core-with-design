/**
 * Open Graph metadata generator.
 * Pure string-based derivation.
 */

export type OpenGraphMeta = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export function generateOpenGraphMeta(input: {
  title: string;
  description: string;
  image: string;
  url: string;
}): OpenGraphMeta {
  return {
    title: input.title,
    description: input.description,
    image: input.image,
    url: input.url,
  };
}

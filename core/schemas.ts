/**
 * Runtime validation schemas.
 *
 * Mirrors types.ts with zod schemas for runtime validation.
 * Each schema corresponds 1:1 to a type in types.ts.
 */

import { z } from "zod";

/* ---------------------------------------------
 * Primitive domain schemas
 * --------------------------------------------- */

export const UUIDSchema = z.string().uuid();
export const ISODateStringSchema = z.string().datetime();

/* ---------------------------------------------
 * Versioning
 * --------------------------------------------- */

export const SemanticVersionSchema = z.object({
  major: z.number().int().nonnegative(),
  minor: z.number().int().nonnegative(),
  patch: z.number().int().nonnegative(),
});

/* ---------------------------------------------
 * Content lifecycle
 * --------------------------------------------- */

export const ContentStateSchema = z.enum([
  "draft",
  "review",
  "published",
  "archived",
]);

/* ---------------------------------------------
 * Localization
 * --------------------------------------------- */

export const LocaleSchema = z.enum(["pt-BR", "en"]);

/* ---------------------------------------------
 * Base entity
 * --------------------------------------------- */

export const BaseEntitySchema = z.object({
  id: UUIDSchema,
  createdAt: ISODateStringSchema,
  updatedAt: ISODateStringSchema,
  version: SemanticVersionSchema,
});

/* ---------------------------------------------
 * Page model
 * --------------------------------------------- */

export const PageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string(),
});

/* ---------------------------------------------
 * SEO model
 * --------------------------------------------- */

export const SeoMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  noindex: z.boolean().optional(),
});

/* ---------------------------------------------
 * Site content (root aggregate)
 * --------------------------------------------- */

export const SiteContentSchema = BaseEntitySchema.extend({
  locale: LocaleSchema,
  pages: z.array(PageSchema).min(1),
  seo: SeoMetadataSchema,
  state: ContentStateSchema,
});

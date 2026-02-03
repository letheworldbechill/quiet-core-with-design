import { useMemo } from "react";
import type { SiteContent, Page } from "../../core";

export type ValidationError = {
  field: string;
  message: string;
  severity: "error" | "warning";
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEO_TITLE_MAX = 60;
const SEO_TITLE_MIN = 30;
const SEO_DESC_MAX = 160;
const SEO_DESC_MIN = 120;

export function validatePage(page: Page, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `Seite ${index + 1}`;

  // Slug validation
  if (!page.slug || page.slug.trim() === "") {
    errors.push({
      field: `pages[${index}].slug`,
      message: `${prefix}: Slug darf nicht leer sein`,
      severity: "error",
    });
  } else if (!SLUG_PATTERN.test(page.slug)) {
    errors.push({
      field: `pages[${index}].slug`,
      message: `${prefix}: Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten`,
      severity: "error",
    });
  }

  // Title validation
  if (!page.title || page.title.trim() === "") {
    errors.push({
      field: `pages[${index}].title`,
      message: `${prefix}: Titel darf nicht leer sein`,
      severity: "error",
    });
  }

  return errors;
}

export function validateSeo(seo: { title: string; description: string }): ValidationError[] {
  const errors: ValidationError[] = [];

  // Title
  if (!seo.title || seo.title.trim() === "") {
    errors.push({
      field: "seo.title",
      message: "SEO-Titel darf nicht leer sein",
      severity: "error",
    });
  } else {
    if (seo.title.length < SEO_TITLE_MIN) {
      errors.push({
        field: "seo.title",
        message: `SEO-Titel ist kurz (${seo.title.length}/${SEO_TITLE_MIN} Zeichen empfohlen)`,
        severity: "warning",
      });
    }
    if (seo.title.length > SEO_TITLE_MAX) {
      errors.push({
        field: "seo.title",
        message: `SEO-Titel ist zu lang (${seo.title.length}/${SEO_TITLE_MAX} Zeichen max)`,
        severity: "warning",
      });
    }
  }

  // Description
  if (!seo.description || seo.description.trim() === "") {
    errors.push({
      field: "seo.description",
      message: "SEO-Beschreibung darf nicht leer sein",
      severity: "error",
    });
  } else {
    if (seo.description.length < SEO_DESC_MIN) {
      errors.push({
        field: "seo.description",
        message: `SEO-Beschreibung ist kurz (${seo.description.length}/${SEO_DESC_MIN} Zeichen empfohlen)`,
        severity: "warning",
      });
    }
    if (seo.description.length > SEO_DESC_MAX) {
      errors.push({
        field: "seo.description",
        message: `SEO-Beschreibung ist zu lang (${seo.description.length}/${SEO_DESC_MAX} Zeichen max)`,
        severity: "warning",
      });
    }
  }

  return errors;
}

export function useValidation(site: SiteContent): ValidationResult {
  return useMemo(() => {
    const allErrors: ValidationError[] = [];

    // Validate pages
    site.pages.forEach((page, index) => {
      allErrors.push(...validatePage(page, index));
    });

    // Validate SEO
    allErrors.push(...validateSeo(site.seo));

    // Check for duplicate slugs
    const slugs = site.pages.map((p) => p.slug);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      allErrors.push({
        field: "pages",
        message: `Doppelte Slugs gefunden: ${[...new Set(duplicates)].join(", ")}`,
        severity: "error",
      });
    }

    const errors = allErrors.filter((e) => e.severity === "error");
    const warnings = allErrors.filter((e) => e.severity === "warning");

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [site]);
}

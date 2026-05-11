/** MVP scope: catalog and profiles are Computer Science only. */
export const MVP_DEPARTMENT_LABEL = "Computer Science";

/** Deterministic placeholder image for catalog cards (no course image in API yet). */
export function courseThumbUrl(seed: string): string {
  const safe = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24) || "course";
  return `https://picsum.photos/seed/${safe}/800/450`;
}

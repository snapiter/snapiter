export function slugify(str: string): string {
  return str
    .toString()
    .normalize("NFKD") // split accented characters into base + diacritic
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

// Matches the DD.MM.YYYY format these pages already used before their
// "last updated" date became server-computed (see backend/src/routes/
// content.js's pageLastUpdated logic) instead of admin-typed free text.
export function formatLegalDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

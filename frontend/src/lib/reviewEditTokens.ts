const STORAGE_KEY = "reviewEditTokens";

type TokenMap = Record<string, string>;

function readMap(): TokenMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveEditToken(reviewId: number, editToken: string) {
  const map = readMap();
  map[reviewId] = editToken;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getEditToken(reviewId: number): string | undefined {
  return readMap()[reviewId];
}

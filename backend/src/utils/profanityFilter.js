const BLOCKED_TERMS = [
  // Hebrew
  "זונה",
  "שרמוטה",
  "זין",
  "בולבול",
  "ציצים",
  "חרא",
  "מזדיין",
  "מזדיינת",
  "תזדיין",
  "מוצצת",
  "מניאק",
  "מנייאקית",
  "מניאקית",
  "בן זונה",
  "בת זונה",
  "בן כלב",
  "כלבה",
  "סעמק",
  "תמותי",
  "ארצח",
  "אהרוג",
  "אדקור",
  "אחנוק",
  "אחסל אותך",
  "אקרע אותך",
  "מפגר",
  "מפגרת",
  "לך תזדיין",
  "טיפשה",
  // Hebrew slang transliterated in Latin letters
  "zonah",
  "zona",
  "sharmuta",
  "kus",
  "zayin",
  "manyak",
  // English
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "whore",
  "slut",
  "faggot",
  "motherfucker",
  "pussy",
  "cock",
  "nigger",
  "nigga",
  "retard",
  "kill you",
  "murder you",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Only the left edge is boundary-checked, so inflected/suffixed forms
// (e.g. "fucking", "bitches", "זונות") are still caught.
const PROFANITY_REGEX = new RegExp(
  `(?<![\\p{L}\\p{N}])(?:${BLOCKED_TERMS.map(escapeRegex).join("|")})`,
  "giu"
);

export function containsProfanity(text) {
  if (!text) return false;
  PROFANITY_REGEX.lastIndex = 0;
  return PROFANITY_REGEX.test(text);
}

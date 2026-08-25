// Standard Israeli Teudat Zehut (ID number) checksum algorithm: each digit
// is weighted 1/2 alternately, two-digit products are digit-summed (i.e.
// reduced by 9), and the total must be a multiple of 10.
export function isValidIsraeliId(id) {
  const trimmed = String(id ?? "").trim();
  if (!/^\d{1,9}$/.test(trimmed)) return false;

  const padded = trimmed.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 === 0;
}

// Matches Israeli mobile (05X-XXXXXXX), landline (0[2/3/4/8/9]-XXXXXXX) and
// 07X virtual numbers, tolerant of spaces/dashes.
export function isValidIsraeliPhone(phone) {
  const digits = String(phone ?? "").replace(/[\s-]/g, "");
  return /^(05\d{8}|0[23489]\d{7}|07\d{8})$/.test(digits);
}

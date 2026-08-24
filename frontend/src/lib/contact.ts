const PHONE_INTL_DIGITS = "972509988848";
const PHONE_DISPLAY = "050-998-8848";

export function whatsappUrl(message?: string) {
  return message ? `https://wa.me/${PHONE_INTL_DIGITS}?text=${encodeURIComponent(message)}` : `https://wa.me/${PHONE_INTL_DIGITS}`;
}

export const WHATSAPP_URL = whatsappUrl();
export const PHONE_TEL_URL = `tel:+${PHONE_INTL_DIGITS}`;
export const PHONE_DISPLAY_NUMBER = PHONE_DISPLAY;
export const INSTAGRAM_URL = "https://www.instagram.com/reut_cosmetics_/";
// Not provided yet — placeholders until real profile links are available.
export const FACEBOOK_URL = "#";
export const TIKTOK_URL = "#";

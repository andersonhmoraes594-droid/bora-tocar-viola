export const WHATSAPP_DISPLAY = "(11) 97395-1734";
export const WHATSAPP_NUMBER = "5511973951734";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

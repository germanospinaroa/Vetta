export function buildGroupInvitationHref(groupUrl: string | undefined) {
  if (!groupUrl) return undefined;
  try {
    const url = new URL(groupUrl.trim());
    if (url.protocol !== "https:" || url.hostname !== "chat.whatsapp.com" || !url.pathname.slice(1)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function buildWhatsAppHref(number: string | undefined, name: string, registrationCode: string) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  if (!/^(?:VETTA|QA)-[A-Z0-9]{8}$/i.test(registrationCode.trim())) return undefined;
  const firstName = name.trim().split(/\s+/)[0] || "participante";
  const message = `¡Hola! Ya me inscribí en NO EMPRENDAS TODAVÍA. Quiero recibir mi regalo y las instrucciones para ingresar al grupo. Mi código es ${registrationCode.trim().toUpperCase()}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

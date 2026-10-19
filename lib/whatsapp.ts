export function buildWhatsAppHref(number: string | undefined, name: string, registrationCode: string) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  const firstName = name.trim().split(/\s+/)[0] || "participante";
  const message = `Hola, soy ${firstName}. Me registré en NO EMPRENDAS TODAVÍA y quiero confirmar mi acceso. Mi código es ${registrationCode}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildGenericWhatsAppHref(number: string | undefined) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  const message = "Hola, estoy continuando mi registro en NO EMPRENDAS TODAVÍA y quiero confirmar mi acceso.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

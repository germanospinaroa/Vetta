export function buildWhatsAppHref(number: string | undefined, name: string, registrationCode: string) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  const message = `Hola, soy ${name}. Me registré en NO EMPRENDAS TODAVÍA y quiero confirmar mi acceso. Mi código es ${registrationCode}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

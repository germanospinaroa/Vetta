export function buildWhatsAppHref(number: string | undefined, name: string, registrationCode: string) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  if (!/^(?:VETTA|QA)-[A-Z0-9]{8}$/i.test(registrationCode.trim())) return undefined;
  const firstName = name.trim().split(/\s+/)[0] || "participante";
  const message = `Hola, soy ${firstName}. Me registré en NO EMPRENDAS TODAVÍA y quiero confirmar mi acceso. Mi código es ${registrationCode.trim().toUpperCase()}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

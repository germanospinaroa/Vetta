import Link from "next/link";
import { UpdatePasswordForm } from "@/components/password-recovery-form";
import { safeInternalPath } from "@/lib/auth-redirect";

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next);
  return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><h1>Establece tu contraseña</h1><p>Elige una contraseña que no hayas usado en otro servicio.</p><UpdatePasswordForm nextPath={nextPath} /></div></main>;
}

import Link from "next/link";
import { ForgotPasswordForm } from "@/components/password-recovery-form";
import { safeInternalPath } from "@/lib/auth-redirect";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next);
  return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><h1>Recupera tu acceso</h1><p>Te enviaremos instrucciones al correo autorizado para establecer una nueva contraseña.</p><ForgotPasswordForm nextPath={nextPath} /></div></main>;
}

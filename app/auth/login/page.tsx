import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/auth-redirect";
import AdminLoginForm from "@/components/admin-login-form";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next);
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(nextPath as never);
  }
  return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><h1>Acceso de operación</h1><p>Entra con el correo autorizado y tu contraseña. Si estás migrando desde enlaces mágicos, puedes solicitar uno temporal.</p><AdminLoginForm nextPath={nextPath} initialError={params.error} /></div></main>;
}

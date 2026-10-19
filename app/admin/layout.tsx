import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export const metadata = { title: "Operación | VETTA", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) notFound();
  const admin = await getAuthorizedAdmin();
  if (!admin) redirect("/auth/not-authorized" as never);
  return <div className="admin-page"><header className="admin-header"><div className="container header-inner"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><nav className="admin-nav" aria-label="Operación"><a href="/admin">Resumen</a><a href="/admin/leads">Prospectos</a><a href="/admin/cohorts">Cohortes</a><a href="/admin/attendance">Asistencia</a><a href="/admin/outcomes">Resultados</a><a href="/admin/qa-whatsapp">QA WhatsApp</a><a href="/admin/qa-funnel">QA Funnel</a><form action="/auth/logout" method="post"><button className="text-button" type="submit">Salir</button></form></nav></div></header>{children}</div>;
}

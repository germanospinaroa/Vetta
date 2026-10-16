import { getAdminLeads } from "@/lib/admin-data";

export default async function LeadsPage() {
  const { configured, leads } = await getAdminLeads();
  return <main><section className="section"><div className="container admin-shell"><p className="section-kicker">Operación / Prospectos</p><h1>Personas y<br /><em>siguientes pasos.</em></h1>{!configured ? <p className="config-note">La lista aparecerá cuando Supabase y RLS estén configurados.</p> : <div className="admin-table-wrap"><table className="admin-table"><caption className="sr-only">Prospectos registrados</caption><thead><tr><th>Nombre</th><th>Código</th><th>Etapa</th><th>Fecha</th></tr></thead><tbody>{leads.map((lead) => <tr key={String(lead.id)}><td>{String(lead.name)}</td><td>{String(lead.registration_code)}</td><td>{String(lead.current_stage)}</td><td>{new Date(String(lead.created_at)).toLocaleDateString("es-CO")}</td></tr>)}</tbody></table>{leads.length === 0 && <p className="empty-state">Todavía no hay prospectos registrados.</p>}</div>}</div></section></main>;
}

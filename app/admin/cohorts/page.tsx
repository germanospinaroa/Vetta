import { getAdminCohorts } from "@/lib/admin-data";

export default async function CohortsPage() {
  const { configured, cohorts } = await getAdminCohorts();
  return <main><section className="section"><div className="container admin-shell"><p className="section-kicker">Operación / Cohortes</p><h1>Experiencias<br /><em>repetibles.</em></h1>{!configured ? <p className="config-note">La gestión de cohortes queda preparada, pendiente de conectar el proyecto Supabase autorizado.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nombre</th><th>Estado</th><th>Zona horaria</th><th>Capacidad</th></tr></thead><tbody>{cohorts.map((cohort) => <tr key={String(cohort.id)}><td>{String(cohort.name)}</td><td>{String(cohort.status)}</td><td>{String(cohort.timezone)}</td><td>{cohort.capacity ? String(cohort.capacity) : "Sin límite"}</td></tr>)}</tbody></table>{cohorts.length === 0 && <p className="empty-state">No hay cohortes creadas.</p>}</div>}</div></section></main>;
}

import { getDashboardCounts } from "@/lib/admin-data";

export default async function AdminPage() {
  const dashboard = await getDashboardCounts();
  return <main><section className="section"><div className="container admin-shell"><p className="section-kicker">Panel interno</p><h1>La operación empieza<br /><em>con evidencia.</em></h1><p className="admin-lede">Un resumen de las etapas registradas. Los números aparecen únicamente cuando provienen de Supabase y de acciones confirmadas.</p><div className="admin-cards">{dashboard.cards.map((card) => <div key={card.label}><strong>{dashboard.configured ? card.value : "—"}</strong><span>{card.label}</span></div>)}</div>{!dashboard.configured && <p className="config-note">Supabase Auth, membresía administrativa y migraciones todavía no están configurados. El panel permanece cerrado en Production.</p>}</div></section></main>;
}

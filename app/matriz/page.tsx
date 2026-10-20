import { redirect } from "next/navigation";

export const metadata = { title: "TU PRÓXIMO MOVIMIENTO | NO EMPRENDAS TODAVÍA.", description: "Explora seis modelos de negocio, compara tres caminos y llévate un plan para investigar el tuyo.", robots: { index: true, follow: true } };

export default function MatrixPage() { redirect("/tu-proximo-movimiento"); }

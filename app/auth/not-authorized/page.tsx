import Link from "next/link";

export default function NotAuthorizedPage() {
  return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><h1>Acceso no autorizado</h1><p>Tu sesión no tiene permisos para operar este panel. Solicita autorización al responsable del proyecto.</p><form action="/auth/logout" method="post"><button className="text-button" type="submit">Cerrar sesión</button></form></div></main>;
}

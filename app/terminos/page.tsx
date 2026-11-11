import Link from "next/link";

export const metadata = {
  title: "Términos de participación | NO EMPRENDAS TODAVÍA.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container narrow">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark">N</span>
          <span>NO EMPRENDAS TODAVÍA.</span>
        </Link>
        <p className="section-kicker">Información de participación</p>
        <h1>Términos de participación</h1>
        <p>
          Estos términos describen la participación en <strong>NO EMPRENDAS TODAVÍA</strong>, una experiencia educativa en vivo de dos encuentros previstos para el martes 17 y el jueves 19 de noviembre de 2026, a las 8:00 p. m., hora de Colombia, sujetos a la información operativa publicada por el responsable.
        </p>

        <h2>Objeto</h2>
        <p>
          La experiencia enseña criterios para evaluar oportunidades de negocio antes de comprometer tiempo, dinero o energía. <strong>EL FILTRO ANTES DEL SÍ</strong> es la forma de presentar comercialmente la Matriz para Evaluar Oportunidades, un recurso complementario.
        </p>

        <h2>Registro y acceso</h2>
        <p>
          La persona debe proporcionar información verdadera y un número de WhatsApp que pueda revisar. El registro se considera recibido únicamente cuando la aplicación confirma su persistencia. Tras registrarse, podrá abrir el enlace de WhatsApp preparado con su nombre y código VETTA de inscripción para validar la conversación operativa.
        </p>
        <p>
          La validación se realiza con el código incluido en el mensaje enviado desde la conversación de WhatsApp. Después de validarlo, el sistema envía la bienvenida con el enlace del grupo y programa aproximadamente dos minutos después un segundo mensaje con el enlace de <strong>EL FILTRO ANTES DEL SÍ</strong>. No se exige responder una palabra concreta ni confirmar el ingreso al grupo para recibir el recurso.
        </p>

        <h2>Naturaleza de la experiencia</h2>
        <p>
          La participación es educativa y orientativa. Los criterios no constituyen asesoría financiera, jurídica, contable ni recomendación personalizada. Ninguna oportunidad o modelo presentado garantiza rentabilidad, crecimiento, recuperación del capital o resultados determinados.
        </p>
        <p>
          Participar no obliga a comprar productos, pagar servicios, incorporarse a un negocio ni continuar una conversación comercial. Si durante el segundo encuentro se presenta una alternativa comercial real, deberá comunicarse de forma transparente y evaluarse con los mismos criterios explicados.
        </p>

        <h2>Fechas, cambios y comunicaciones</h2>
        <p>
          Las fechas, enlaces e instrucciones se comunicarán por los canales configurados para la cohorte. Deben confirmarse antes de aplicar reglas sobre reprogramaciones, cancelaciones, cambios de enlace, grabaciones —si existieran— y casos de no asistencia.
        </p>
        <p>
          Las comunicaciones operativas se limitarán a lo necesario para gestionar la experiencia. Cualquier comunicación comercial posterior requiere autorización separada cuando corresponda.
        </p>

        <h2>Herramienta complementaria</h2>
        <p>
          La matriz organiza preguntas, observaciones y asuntos pendientes. Sus resultados son orientativos y no determinan automáticamente qué oportunidad debe elegirse. La información introducida en <code>/matriz</code> se conserva localmente en el dispositivo y puede exportarse; no se envía a la base de datos por defecto.
        </p>

        <h2>Contacto</h2>
        <p>
          Las consultas legales y de privacidad pueden dirigirse a <a href="mailto:support@gritlab.pro">support@gritlab.pro</a> o al <a href="tel:+573150706885">+57 315 070 6885</a>. El WhatsApp operativo del evento es <a href="tel:+573142694269">+57 314 269 4269</a>. El responsable indicado es Germán Ospina Roa, Carrera 63 #90-42, Bogotá D. C., Colombia.
        </p>

        <Link className="text-link" href="/">Volver a la experiencia</Link>
      </div>
    </main>
  );
}

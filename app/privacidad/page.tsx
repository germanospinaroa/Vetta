import Link from "next/link";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";

const effectiveDate = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
}).format(new Date());

export const metadata = {
  title: "Política de tratamiento de datos personales | NO EMPRENDAS TODAVÍA.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container narrow">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark">N</span>
          <span>NO EMPRENDAS TODAVÍA.</span>
        </Link>
        <p className="section-kicker">Política de tratamiento de datos personales</p>
        <h1>Política de tratamiento de datos personales</h1>
        <p><strong>Fecha de entrada en vigencia:</strong> {effectiveDate}</p>

        <h2>Responsable, domicilio y contacto</h2>
        <p>El responsable del tratamiento es <strong>Germán Ospina Roa</strong>, persona natural en Colombia. Dirección: <strong>Carrera 63 #90-42, Bogotá D. C., Colombia</strong>. Teléfono: <strong>+57 315 070 6885</strong>.</p>
        <p>El canal oficial para consultas, peticiones, reclamos, revocatorias y solicitudes de protección de datos es <a href="mailto:support@gritlab.pro">support@gritlab.pro</a>.</p>

        <h2>Datos tratados y tipo de tratamiento</h2>
        <p>El tratamiento es manual y automatizado, y puede incluir recolección, almacenamiento, consulta, organización, circulación controlada, registro, envío a proveedores y supresión cuando corresponda.</p>
        <p>Para gestionar la inscripción se tratan nombre, número de WhatsApp, ciudad, país, código de registro, consentimiento, fecha de registro y parámetros UTM cuando estén presentes.</p>
        <p>La operación de WhatsApp mediante Evolution API puede tratar el número remitente, identificadores de WhatsApp, identificadores de proveedor, tipo de mensaje, fecha, estado de procesamiento, hash del mensaje y acciones operativas. El sistema reconoce mensajes como <strong>LISTO</strong>, relaciona el remitente con una inscripción, registra eventos operativos y puede enviar automáticamente mensajes de bienvenida y el enlace de la matriz mediante la instancia de WhatsApp configurada en Evolution API.</p>
        <p>La matriz funciona localmente en el dispositivo. Sus respuestas y resultados no se envían a Supabase ni se incluyen como propiedades de eventos de analítica.</p>

        <h2>Finalidades</h2>
        <ul>
          <li>Recibir, validar y gestionar inscripciones.</li>
          <li>Crear un registro operativo y asignar un código.</li>
          <li>Enviar comunicaciones operativas relacionadas con la experiencia.</li>
          <li>Procesar mensajes entrantes mediante Evolution API, reconocer <strong>LISTO</strong>, registrar acciones y entregar automáticamente la matriz cuando corresponda.</li>
          <li>Conservar atribución UTM cuando exista.</li>
          <li>Registrar eventos operativos necesarios para administrar la experiencia.</li>
          <li>Medir conversiones publicitarias mediante Meta Pixel, identificador <strong>3337529346452736</strong>, solo con permiso publicitario.</li>
          <li>Analizar interacciones mediante Microsoft Clarity, identificador <strong>z0c14ujntu</strong>, solo con permiso analítico.</li>
          <li>Atender consultas, derechos, revocatorias, solicitudes de eliminación y obligaciones legales.</li>
        </ul>

        <h2>Meta Pixel y datos técnicos</h2>
        <p>Meta Pixel se carga únicamente cuando la persona acepta la preferencia separada de medición publicitaria. El evento <strong>Lead</strong> solo se envía después de que el servidor confirma una inscripción nueva persistida.</p>
        <p>El píxel y Meta pueden recibir automáticamente información técnica como dirección IP, URL, página de referencia, fecha y hora, navegador, dispositivo, sistema operativo, identificadores técnicos y cookies o valores equivalentes que Meta pueda establecer o leer, incluidos identificadores de publicidad cuando estén disponibles. El sitio no envía nombres, teléfonos, códigos de registro ni respuestas de la matriz como propiedades del evento.</p>

        <h2>Microsoft Clarity y datos técnicos</h2>
        <p>Microsoft Clarity se carga únicamente cuando la persona acepta la preferencia separada de analítica. Puede recibir información técnica y de interacción como URL, navegación, tamaño de pantalla, dispositivo, navegador, rendimiento, eventos de interacción e identificadores de sesión. Clarity puede utilizar cookies o identificadores técnicos conforme a su configuración y documentación vigente.</p>
        <p>Los formularios, la confirmación, la matriz y las superficies administrativas están marcados para enmascaramiento. No se envían respuestas de la matriz ni valores de campos como propiedades de eventos personalizados.</p>

        <h2>WhatsApp, Evolution API e infraestructura</h2>
        <p>Las comunicaciones operativas automatizadas utilizan Evolution API, una instancia de WhatsApp configurada para VETTA y el webhook protegido de la aplicación. VETTA recibe eventos de mensajes y grupos, los relaciona con registros de Supabase cuando es posible, registra el estado operativo y puede enviar mensajes de bienvenida o el enlace de la matriz.</p>

        <h2>Consentimientos</h2>
        <p>El consentimiento para gestionar la inscripción y las comunicaciones operativas se solicita dentro del formulario y es independiente de las tecnologías opcionales.</p>
        <p>Las preferencias de Meta Pixel y Microsoft Clarity son separadas. El acceso <strong>Preferencias de privacidad</strong> permite aceptar, rechazar y modificar cada permiso. Rechazar tecnologías opcionales no impide registrarse.</p>
        <p>Las preferencias se almacenan en el navegador. Al retirar un permiso, el sistema deja de enviar nuevos eventos de esa categoría y aplica la señal de revocación correspondiente al proveedor cargado. La retirada no elimina por sí sola registros operativos que deban conservarse.</p>

        <h2>Proveedores y destinatarios</h2>
        <p>La operación utiliza Supabase/PostgreSQL para persistencia y autenticación administrativa, Vercel para alojamiento, Resend para correo de soporte, Evolution API como software de integración y una instancia de WhatsApp cuya infraestructura de alojamiento no está identificada en esta aplicación, Meta para medición publicitaria y Microsoft para Clarity.</p>
        <p>Los proveedores pueden procesar datos desde jurisdicciones distintas de Colombia. La documentación pública consultada indica que Supabase puede usar subencargados y procesar datos fuera de la región elegida, que Vercel tiene instalaciones principales de procesamiento en Estados Unidos y puede procesar datos donde opere con sus subencargados, y que Resend tiene operaciones principales en Estados Unidos. Microsoft Clarity actúa como responsable independiente según sus términos. Estas condiciones no sustituyen la verificación del plan, contrato, región y configuración concreta de VETTA.</p>
        <p>Evolution API es software open source; su proveedor de infraestructura, región, contrato y garantías aplicables no están confirmados en el repositorio. Tampoco se afirma una región, transferencia, garantía o acuerdo contractual específico para Meta, Clarity o la instancia de WhatsApp que no haya sido confirmado por el responsable.</p>

        <h2>Conservación</h2>
        <p>Los datos de inscripción, consentimiento, atribución, comunicaciones y eventos operativos se conservarán durante <strong>doce meses</strong>, contados desde el cierre operativo de la cohorte o desde la última interacción operativa necesaria, lo que ocurra después.</p>
        <p>Podrán aplicarse excepciones debidamente justificadas por obligaciones legales, reclamaciones, solicitudes de derechos en trámite, controversias, auditorías o procedimientos pendientes. Una vez vencido el plazo y sin una excepción aplicable, los datos serán eliminados, anonimizados o bloqueados mediante el procedimiento operativo autorizado.</p>

        <h2>Derechos y procedimiento</h2>
        <p>La persona titular puede conocer, actualizar, rectificar y corregir sus datos; solicitar prueba de la autorización; conocer el uso de la información; solicitar supresión cuando proceda; revocar autorizaciones; y presentar consultas o reclamos ante el responsable o ante la autoridad competente.</p>
        <p>Las solicitudes deben enviarse a <a href="mailto:support@gritlab.pro">support@gritlab.pro</a>, indicando nombre, medio de contacto, derecho que desea ejercer y descripción de la solicitud. Se verificará razonablemente la identidad y se dejará constancia de la recepción y trámite.</p>

        <h2>Seguridad</h2>
        <p>Se aplican controles de acceso administrativo, RLS en Supabase, separación de secretos, minimización de datos, protección del webhook de Evolution API y enmascaramiento de superficies sensibles.</p>
        <p><PrivacyPreferencesButton /></p>
        <Link className="text-link" href="/">Volver a la experiencia</Link>
      </div>
    </main>
  );
}

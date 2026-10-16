# VETTA

Sistema de adquisición, activación y operación de **NO EMPRENDAS TODAVÍA**.

## Arranque local en modo TEST

```bash
cp .env.example .env.local
npm install
npm run dev
```

El modo TEST usa una cohorte ficticia y un almacenamiento en memoria. Para probar el enlace de WhatsApp, asigna en `.env.local` un número de prueba a `NEXT_PUBLIC_WHATSAPP_NUMBER`. No uses credenciales reales ni datos de producción.

Validación local:

```bash
npm run verify
```

## Configuración de Supabase

1. Crear un proyecto Supabase separado de cualquier proyecto existente.
2. Copiar su URL y clave publicable a `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Mantener `SUPABASE_SERVICE_ROLE_KEY` únicamente en el servidor; nunca en `NEXT_PUBLIC_*` ni en el navegador.
4. Aplicar `supabase/migrations/0001_initial.sql` mediante el flujo controlado de Supabase. Esta entrega no ejecuta migraciones remotas.
5. Crear el usuario administrador en Supabase Auth y añadir su `user_id` a `admin_members`. La autorización del panel depende de esa tabla y de RLS; `VETTA_ADMIN_EMAILS` no sustituye a la autorización de base de datos.
6. Crear la primera cohorte en la tabla `cohorts`, con fechas, zona horaria, enlaces y número oficial verificados. Configurar su identificador en `NEXT_PUBLIC_ACTIVE_COHORT_ID`.
7. Revisar legalmente el aviso de privacidad y los términos antes de abrir registros reales.

Mientras no existan esos valores, la landing permanece en modo seguro de preapertura y el panel administrativo no se muestra.

## Rutas

- `/` — landing y registro.
- `/matriz` — matriz local, sin cuenta y sin persistencia de datos en servidor.
- `/admin` — acceso privado pendiente de Supabase Auth, membresía y RLS.
- `/privacidad` y `/terminos` — borradores claramente marcados para revisión legal.

## Alcance deliberadamente no integrado

No se conectan WhatsApp Business API, Meta Pixel, Conversion API, 21st.dev, pagos ni despliegues automáticos. Los eventos públicos se registran solo con configuración propia y consentimiento aplicable. Los valores TEST no deben publicarse como datos comerciales.

## Preparación de producción

Antes de publicar: configurar dominio y `NEXT_PUBLIC_SITE_URL`, cohorte real, WhatsApp oficial, reuniones, textos legales aprobados, contacto y responsable de datos, Supabase Auth/RLS, límites contra abuso, revisión de dependencias, variables de Vercel, observabilidad y plan de reversión. Ejecutar `npm run verify` y repetir QA de navegador en la URL de preview autorizada.

## Production actual

La landing está publicada en un proyecto Vercel aislado como preapertura: `https://vetta-beryl.vercel.app`. El registro permanece cerrado porque no hay una cohorte ni persistencia Supabase autorizadas. El panel administrativo falla cerrado y no expone datos sin sesión y membresía válida.

# QA V6 — Preview

Preview: https://vetta-oki8v3snj-germans-projects-baef13ff.vercel.app
Deployment: `dpl_GrcV5wJzUqmTwxQExYqMgZmsFhLU`
Estado: `READY` · target `preview`

## Validaciones

- Lint: PASS.
- TypeScript: PASS.
- Tests: PASS — 4 archivos, 73 pruebas.
- `git diff --check`: PASS.
- Build remoto Vercel: PASS.
- `/`, `/registro` y `/confirmacion`: HTTP 200.
- CTA del header, móvil y sesiones: `#inscripcion`; la landing no navega a `/registro`.
- Landing V6 contiene hero/formulario, reconocimiento, dos sesiones, bloque humano/regalo, FAQ de tres preguntas y footer.
- No se modificaron Supabase, cohortes, Evolution, WhatsApp operativo, cron, SOLDI ni TU PRÓXIMO MOVIMIENTO.
- No se crearon registros reales ni se enviaron mensajes.

## Overflow y responsive

Se validó mediante CDP con emulación real de dispositivo. A 320 px: `innerWidth=320`, `documentElement.scrollWidth=320`, `body.scrollWidth=320`; los textos, botones e inputs críticos quedan dentro del viewport. Se revisaron 320, 375, 390, 430, 768, 1024 y 1440 px. El nuevo contenedor V6 no usa `overflow:hidden` para ocultar desbordamientos del layout.

## Lighthouse Preview 13.6.0

Dos corridas por perfil, sin modificar código para maquillar la métrica:

| Perfil | Corrida | Performance | Accessibility | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Móvil | 1 | 0.82 | 0.96 | 1.0 s | 0 | 760 ms |
| Móvil | 2 | 0.71 | 0.96 | 1.0 s | 0 | 3,440 ms |
| Escritorio | 1 | 0.71 | 0.96 | 1.0 s | 0 | 710 ms |
| Escritorio | 2 | 0.69 | 0.96 | 1.0 s | 0 | 830 ms |

El LCP y CLS son estables y cumplen los objetivos de laboratorio. La variación del score está dominada por ejecución JavaScript/TBT e interacción: escritorio mostró Interactive 5.6–5.8 s, y móvil 5.5–7.4 s. Lighthouse también reporta oportunidades de aproximadamente 103 KiB de JavaScript no utilizado, 27 KiB de CSS no utilizado, 109 KiB de caché, 26 KiB de JavaScript legacy y recursos bloqueantes. No se alteró el embudo para perseguir un score cosmético.

## Evidencia

Las capturas CDP `*-cdp.png` son las usadas para la validación real de viewport. La captura de confirmación es el estado seguro sin registro real; no contiene código, teléfono ni datos personales.

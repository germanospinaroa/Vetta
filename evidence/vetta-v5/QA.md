# QA V5 — conversión directa

Fecha: 11 de noviembre de 2026 (UTC)

## Preview

- URL: https://vetta-imfpdlb56-germans-projects-baef13ff.vercel.app
- Deployment: `dpl_DWub5ixwgx2Fknq1FW3xSwmJ4k8k`
- Target: `preview`
- Estado: `READY`
- Production no fue desplegado ni promovido.

El Preview usado para las capturas tiene `VETTA_DEMO_MODE=true` y la cohorte existente como identificador para mostrar el formulario sin utilizar credenciales operativas ni escribir en Supabase. No se configuró un número comercial en el Preview, por lo que no se envió ningún WhatsApp.

## Cambios verificados

- Landing V5 con formulario real dentro del hero en escritorio.
- En móvil, el orden es hero → formulario, sin bloques intermedios.
- Header, hero y sesiones usan `#inscripcion`; no hay CTA de landing hacia `/registro`.
- `/registro` conserva la compatibilidad y reutiliza `RegistrationForm`.
- `/confirmacion` conserva código dinámico, WhatsApp precargado, grupo real y estados sin falsos positivos.
- Landing contiene únicamente hero/formulario, beneficios, dos sesiones, franja compacta equipo/regalo, tres FAQ y footer.
- Se eliminaron de la landing las secciones/frases de V4 indicadas como obsoletas.
- No se modificaron Supabase, cohortes, Evolution, WhatsApp operativo, cron, SOLDI ni TU PRÓXIMO MOVIMIENTO.

## Evidencia visual

- [Landing completa móvil 390](</config/workspace/Vetta/evidence/vetta-v5/after-390-full.png>)
- [Landing completa escritorio 1440](</config/workspace/Vetta/evidence/vetta-v5/after-1440-full.png>)
- [Hero + formulario móvil](</config/workspace/Vetta/evidence/vetta-v5/after-390-hero-form.png>)
- [Registro compatible móvil](</config/workspace/Vetta/evidence/vetta-v5/after-registro-390.png>)
- [Confirmación móvil](</config/workspace/Vetta/evidence/vetta-v5/after-confirmacion-390.png>)
- Capturas adicionales completas: `after-320-full.png`, `after-375-full.png`, `after-430-full.png`, `after-768-full.png`, `after-1024-full.png`.

La revisión visual se realizó en 320, 375, 390, 430, 768, 1024 y 1440 px. No se detectó overflow horizontal en la composición V5; los campos tienen tamaño mínimo de 16 px en móvil, foco visible y soporte para `prefers-reduced-motion`.

## QA técnico

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 4 archivos, 73 pruebas.
- `git diff --check`: PASS.
- Build remoto Vercel: PASS; 36 rutas generadas y deployment READY.
- HTTP Preview `/`, `/registro`, `/confirmacion`: 200.
- Conteo visible de FAQ: 3.
- Conteo de CTA de landing: todos usan `#inscripcion`; `href="/registro"` no aparece en el HTML de `/`.
- El asset de equipo se sirve desde `Team.png` mediante `next/image` y se carga debajo del hero.

## Lighthouse Preview

Lighthouse 13.6.0, corrida puntual:

| Perfil | Performance | Accessibility | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| Móvil | 0.92 | 0.96 | 0.9 s | 0 |
| Escritorio | 0.75 | 0.96 | 0.9 s | 0 |

No se presentan estas cifras como una garantía para todas las redes o dispositivos.

## Flujo y límites de prueba

- La navegación del CTA a `#inscripcion` y el foco del primer input se implementaron en `SalesCta`.
- El submit sigue siendo el único `POST /api/register`, con la validación y tracking existentes; en `/` y `/registro` se conserva `redirectOnSuccess` hacia `/confirmacion`.
- No se creó una inscripción real, no se envió WhatsApp y no se alteraron registros históricos. La confirmación con código real requiere un lead autorizado o fixture aislado; el Preview se validó en su estado de acceso público para no contaminar producción.

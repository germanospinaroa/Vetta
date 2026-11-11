# QA — VETTA Landing V4

Fecha: 11 de noviembre de 2026 (UTC)

## Alcance

- Landing oficial: `https://noemprendas.gritlab.pro/`
- Registro: `/registro`
- Confirmación: `/confirmacion`
- Cohorte esperada: `ce5b49da-7f3e-41f4-a2e5-36e1bdfd3863`
- No se crearon registros ni se enviaron mensajes reales durante esta validación.

## Evidencia visual

Capturas previas y posteriores disponibles en esta carpeta. La landing fue capturada en 320, 375, 390, 430, 768, 1024 y 1440 px; registro y confirmación en 390 px. La revisión visual se hizo sobre la implementación renderizada y se corrigieron la jerarquía del hero, el orden móvil, la identificación de fechas, el CTA primario, la consistencia de registro/confirmación y la presentación del regalo.

Nota: las capturas CLI de Chromium de ancho móvil no aplican emulación de dispositivo de forma idéntica a un teléfono y pueden recortar el viewport visual; Lighthouse sí ejecutó emulación móvil real para las métricas. No se usa esta limitación para afirmar un PASS visual absoluto en un dispositivo físico.

## Verificaciones funcionales

- `GET /`, `GET /registro` y `GET /confirmacion`: HTTP 200.
- El HTML público contiene 17 y 19 de noviembre y no contiene las fechas de octubre ni 3/5 de noviembre.
- El metadato title público contiene `17 y 19 de noviembre`.
- El asset auténtico de `TU PRÓXIMO MOVIMIENTO` responde HTTP 200.
- El formulario mantiene la validación, persistencia, código VETTA, deduplicación y redirección existentes.
- La confirmación mantiene el mensaje WhatsApp precargado con código individual y el enlace real del grupo; el clic se registra sin presentarlo como membresía o confirmación del webhook.
- No se tocó el cron ni la integración operativa de Evolution, Supabase, SOLDI o la herramienta del regalo.

## Calidad técnica

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 4 archivos, 73 pruebas.
- `git diff --check`: PASS.
- `npm run build`: compilación, TypeScript, generación de 36 rutas y optimización PASS; el comando termina después con `SecurityFatalError` de Next.js 16.4.0 por una recomendación de actualización de seguridad del runtime. El deployment remoto sí terminó READY.

## Lighthouse

Baseline entregada por el expediente: móvil 78, LCP 5.7 s; escritorio 100, LCP 0.7 s.

Medición posterior en Production, Lighthouse 13.6.0:

| Perfil | Performance | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: |
| Móvil | 0.93 | 1.0 s | 0 | 330 ms |
| Escritorio | 0.87 | 1.0 s | 0 | 250 ms |

Las métricas son una corrida puntual de Lighthouse y no una promesa de rendimiento para todas las redes o dispositivos.

## Limitaciones

- No se ejecutó una inscripción real ni se envió WhatsApp a un contacto para preservar los datos y la operación. El recorrido de formulario, código, enlaces y estados se verificó por código, pruebas existentes y superficie pública.
- La pantalla de confirmación se capturó en su estado público sin lead real; no se creó un fixture persistido que pudiera contaminar Supabase.
- No se realizó prueba física en un teléfono receptor ni se afirmó entrega/lectura de WhatsApp.

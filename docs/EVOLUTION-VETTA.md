# Integración VETTA / Evolution API

## Estado

La instancia `momentum` de Evolution API 2.3.7 está conectada y asociada al número oficial de eventos. VETTA usa una credencial limitada a esa instancia en Vercel Production; la API key global no se expone al navegador ni se guarda en el repositorio.

El endpoint de recepción es:

`POST /api/webhooks/evolution`

La autenticación utiliza la cabecera privada `x-vetta-evolution-token`. El endpoint limita el cuerpo a 256 KiB, rechaza JSON inválido, ignora mensajes enviados por la propia cuenta y no almacena payloads completos.

## Activación pendiente

Aplicar manualmente `supabase/migrations/0003_whatsapp_integration.sql` en el proyecto Supabase autorizado. La comprobación actual devuelve `404` para `whatsapp_inbound_messages`, por lo que el webhook todavía no debe asociarse a `momentum`.

Después de aplicar la migración:

1. Confirmar que existen `whatsapp_inbound_messages` y `whatsapp_outbound_messages` con RLS activo.
2. Confirmar que `VETTA_GROUP_JID` corresponde al grupo `Antes De Emprender`.
3. Configurar en Evolution, únicamente para `momentum`, `POST /webhook/set/momentum` con:
   - `enabled: true`
   - `url: https://noemprendas.gritlab.pro/api/webhooks/evolution`
   - `byEvents: false`
   - `base64: false`
   - eventos `MESSAGES_UPSERT`, `GROUP_PARTICIPANTS_UPDATE`, `CONNECTION_UPDATE`
   - cabecera `x-vetta-evolution-token` con el secreto de Vercel
4. Verificar con `GET /webhook/find/momentum` que la URL y los eventos coinciden.
5. Probar con un teléfono externo autorizado.

## Comportamiento

- Un mensaje entrante se busca por teléfono normalizado dentro de la cohorte activa.
- Un mensaje duplicado por `provider_message_id` no genera otra respuesta.
- La bienvenida se registra como salida `welcome` y se envía una sola vez por lead.
- `LISTO` se registra como declaración pendiente; no prueba por sí solo la pertenencia al grupo.
- `group_join_verified` solo se registra cuando Evolution notifica un participante del JID configurado.
- La matriz se envía después de esa verificación y de un `LISTO` previo; `matrix_sent` solo se registra tras una respuesta exitosa de Evolution.
- Los errores de envío quedan como `failed` para reintento controlado.

No se abre la cohorte ni se activa captación pública como parte de esta integración.

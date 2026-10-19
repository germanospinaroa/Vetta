# Integración VETTA / Evolution API

## Estado

La instancia `momentum` de Evolution API 2.3.7 está conectada y asociada al número oficial de eventos. Su webhook está activo únicamente para VETTA con eventos `MESSAGES_UPSERT`, `GROUP_PARTICIPANTS_UPDATE` y `CONNECTION_UPDATE`. VETTA usa una credencial limitada a esa instancia en Vercel Production; la API key global no se expone al navegador ni se guarda en el repositorio.

El endpoint de recepción es:

`POST /api/webhooks/evolution`

La autenticación utiliza la cabecera privada `x-vetta-evolution-token`. El endpoint limita el cuerpo a 256 KiB, rechaza JSON inválido, ignora mensajes enviados por la propia cuenta y no almacena payloads completos.

## Prueba real pendiente

La migración `0003_whatsapp_integration.sql` está aplicada. Las tablas existen con RLS y el acceso público no devuelve filas. `VETTA_GROUP_JID` corresponde al grupo `Antes De Emprender`.

La prueba restante requiere un teléfono externo autorizado. Debe demostrar recepción real, bienvenida personalizada, incorporación al grupo, `LISTO` y entrega de la matriz. No se considera completada por una respuesta HTTP de Evolution.

## Comportamiento

- Un mensaje entrante se busca por teléfono normalizado dentro de la cohorte activa.
- Un mensaje duplicado por `provider_message_id` no genera otra respuesta.
- La bienvenida se registra como salida `welcome` y se envía una sola vez por lead.
- `LISTO` se registra como declaración pendiente; no prueba por sí solo la pertenencia al grupo.
- `group_join_verified` solo se registra cuando Evolution notifica un participante del JID configurado.
- La matriz se envía después de esa verificación y de un `LISTO` previo; `matrix_sent` solo se registra tras una respuesta exitosa de Evolution.
- Los errores de envío quedan como `failed` para reintento controlado.

No se abre la cohorte ni se activa captación pública como parte de esta integración.

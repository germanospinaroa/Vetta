# Estado operativo de migraciones

La infraestructura de entrega diferida de WhatsApp (`0005_whatsapp_scheduled_delivery.sql`)
fue aplicada directamente en Supabase Production y verificada allí. No debe
reaplicarse desde el repositorio.

La activación de `vetta-deliver-due-messages` es una operación posterior e
independiente: requiere primero los secretos de Vault y la variable privada de
Vercel. El SQL operativo está en `supabase/operations/activate-vetta-whatsapp-cron.sql`;
no se debe ejecutar `0005` para activar el job. Los registros en estado `attempting` no se reintentan automáticamente;
se reportan para conciliación con Evolution antes de recuperar uno.

La migración `0006_whatsapp_operational_conversations.sql` separa el teléfono
declarado en el formulario de la conversación de WhatsApp validada mediante
código. Está preparada para aplicarse como migración independiente y aún no
debe considerarse aplicada en Production hasta verificarla allí. No crea otro
cron: hace inelegibles para envío los trabajos históricos que no tienen
`conversation_id` y `recipient_jid`.

La migración `0007_meta_attribution.sql` añade únicamente columnas opcionales
para `fbclid`, `fbp` y `fbc` en `campaign_attribution`. Debe aplicarse de forma
coordinada con el despliegue que consume esos campos.

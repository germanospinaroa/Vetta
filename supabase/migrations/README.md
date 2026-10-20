# Estado operativo de migraciones

La infraestructura de entrega diferida de WhatsApp (`0005_whatsapp_scheduled_delivery.sql`)
fue aplicada directamente en Supabase Production y verificada allí. No debe
reaplicarse desde el repositorio.

La activación de `vetta-deliver-due-messages` es una operación posterior e
independiente: requiere primero los secretos de Vault y la variable privada de
Vercel. Los registros en estado `attempting` no se reintentan automáticamente;
se reportan para conciliación con Evolution antes de recuperar uno.

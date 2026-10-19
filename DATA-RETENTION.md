# Procedimiento operativo de conservación y eliminación de datos

## Alcance

Este procedimiento aplica a los datos operativos de VETTA, incluidos los registros de `leads`, consentimientos, atribución UTM, eventos operativos y mensajes entrantes y salientes relacionados con WhatsApp. La matriz continúa siendo local-first y sus respuestas no forman parte del conjunto ordinario de datos de inscripción.

## Regla de conservación

La conservación autorizada es de doce meses, contados desde el cierre operativo de la cohorte o desde la última interacción operativa necesaria, lo que ocurra después.

Se excluyen temporalmente de eliminación los registros sujetos a una obligación legal, una reclamación, una solicitud de derechos en trámite, una controversia, una auditoría o un procedimiento pendiente. La excepción debe quedar justificada y asociada al registro o conjunto de registros afectado.

## Responsable y registro privado

La revisión mensual está a cargo de Germán Ospina Roa, responsable del tratamiento, o de una persona que este
autorice expresamente. El resultado se conserva en un registro privado de cumplimiento, separado de la información
operativa pública y sin incluir nombres, números de WhatsApp, códigos, mensajes ni otros datos personales. El
registro contiene únicamente la fecha de revisión, el conjunto o referencia técnica revisada, la acción ejecutada,
la existencia y justificación de cualquier excepción, la fecha de próxima revisión y la autorización correspondiente.

## Estado actual

No existe una tarea automática de purga documentada ni implementada en el repositorio. Hasta que se autorice y construya un mecanismo automatizado, la revisión es manual, periódica y realizada por una persona con autorización administrativa sobre Supabase.

## Procedimiento mensual

1. La persona autorizada genera una lista de registros cuyo plazo de doce meses haya vencido, usando la fecha de cierre operativo de la cohorte o, si es posterior, la última interacción operativa necesaria.
2. Revisa cada candidato y consulta si existe una excepción documentada o una solicitud pendiente. Los candidatos con excepción se marcan como retenidos, con motivo y fecha de próxima revisión.
3. Para cada candidato sin excepción, registra la fecha de revisión, el alcance, la decisión y la persona que la aprobó antes de ejecutar cambios.
4. Elimina o anonimiza los datos personales en Supabase mediante el procedimiento administrativo autorizado. La operación debe considerar sus relaciones: los registros dependientes con borrado en cascada, los eventos que conservan referencias nulas y los mensajes de WhatsApp cuyo `lead_id` puede quedar nulo.
5. Verifica que no permanezcan nombre, número de WhatsApp, identificadores de contacto ni contenido personal en los registros incluidos, salvo lo estrictamente retenido por una excepción documentada.
6. Conserva la evidencia mínima en el registro privado definido arriba, sin duplicar los datos eliminados. La evidencia debe permitir demostrar qué se revisó, cuándo, con qué autorización y si se eliminó, anonimizó o retuvo.

## Eliminación, anonimización y recuperación

La elección entre eliminar y anonimizar debe documentarse por conjunto de datos y ser coherente con la finalidad residual autorizada. La eliminación puede ser irreversible; antes de ejecutarla se requiere la revisión y aprobación del responsable. No se asume la existencia de copias de seguridad, retención técnica o restauración en una región determinada que no haya sido confirmada con el proveedor correspondiente.

Si una excepción deja de aplicar, el registro vuelve al siguiente ciclo de revisión. Si se requiere automatizar el proceso, deberá aprobarse un cambio separado con modo de simulación, bloqueo por excepciones, registro de auditoría, control de acceso y una prueba de no afectación de inscripciones activas.

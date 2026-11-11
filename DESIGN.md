# DISEÑO ESPECIFICADO — VETTA / NO EMPRENDAS TODAVÍA

## Concepto rector: «EL MOMENTO ANTES DEL SÍ»

La landing debe sentirse como una pieza editorial contemporánea sobre decisiones empresariales: contrastes elegantes, ritmo, fotografía real cuando aporta evidencia y tipografía contundente. **No** como una web SaaS, un catálogo de cards, un curso con cronómetro ni un funnel genérico.

La diferencia visual central: la página demuestra el método con la tensión **«lo que te dicen» / «lo que tienes que comprobar»**, en vez de enumerar supuestos beneficios de forma genérica.

## 1. Sistema visual definitivo

| Token | Valor | Uso |
|---|---|---|
| `--vetta-ink` | `#142238` | Hero, títulos, cierre oscuro |
| `--vetta-cobalt` | `#2758E9` | CTA, enlaces, indicador activo |
| `--vetta-paper` | `#F6F3EC` | Fondo editorial cálido |
| `--vetta-white` | `#FFFFFF` | Áreas de lectura, sobre tinta oscura |
| `--vetta-mist` | `#EAF0FF` | Fondo de comparaciones y FAQ |
| `--vetta-slate` | `#35435A` | Cuerpo de texto principal |
| `--vetta-muted` | `#59677B` | Texto secundario sobre fondos claros |
| `--vetta-signal` | `#E3A03C` | Acento limitado a fecha, línea o numeración |

Los contrastes revisados entre combinaciones principales son aproximadamente: blanco/cobalto 5,74:1, papel/tinta 14,4:1, muted/papel 5,19:1, slate/mist 8,76:1. **No usar cobalto como texto pequeño sobre tinta oscura** (contraste insuficiente). Sobre fondo oscuro, usar papel/blanco o signal.

**Tipografía:** Manrope para títulos; Inter para lectura, controles y etiquetas. No instalar nuevas fuentes. H1 peso 800; H2 peso 700; cuerpo 400–500; eyebrow 600–700 con tracking moderado. Preferir mayúsculas en etiquetas y CTA, no en párrafos.

**Anchos:** shell 1200px máximo, padding desktop 48px, tablet 28px, móvil 20px (320px: 16px). Grid 12 columnas desktop, 4 mobile. Gaps 12, 16, 24, 32, 48, 64px. No gaps vacíos de 160px solo para “aire”.

**Espaciado vertical objetivo:** 88px desktop entre bandas, 56px mobile; ajustar a contenido real. Hero desktop padding top 84px / bottom 92px; mobile top 44px / bottom 48px. La densidad debe ser visualmente deliberada, nunca una columna de textos apretados.

**Botones:** alto mínimo 52px desktop, 50px mobile; padding horizontal 24–30px; radio 12px; fondo azul cobalto, texto blanco; hover con movimiento máximo de 2px y transición 160–220ms. Focus-visible de 3px que contraste con el fondo. Botones blancos sobre fondo oscuro solo en secundarias explícitas, jamás competir con el CTA principal. Todos los CTA del documento editorial conducen a la ruta existente `/registro`.

**Motion:** una entrada sutil por scroll no necesaria para entender contenido, máximo 300ms. Desactivar con `prefers-reduced-motion`. No introducir Framer Motion ni WebGL/Three.js, ni efectos de partículas, parallax costoso, canvas ornamental, carruseles o vídeo autoplay.

**Imágenes:** si se usa la foto de `Team.png`, es la imagen grupal real existente en el proyecto, no una foto de stock. Verificar carga efectiva, permisos y dimensiones. No etiquetar cada rostro por adivinación. Para el regalo, utilizar **captura auténtica** de la herramienta publicada, no mockup inventado. No añadir fotos genéricas de empresarios con maletín ni manos estrechándose.

## 2. Arquitectura visual exacta

### SECCIÓN 1: cabecera + hero

**Fondo:** tinta `#142238`. Una malla de líneas muy tenues en CSS/SVG ligero con opacidad 0.04–0.06 en un extremo; sin degradados de arco iris. Un acento fino de color signal.

**Composición desktop:**
- Shell 1200px. Nav superior alineado horizontalmente: marca a la izquierda, fecha pequeña y CTA discreto a la derecha. Cabecera no debe dominar el hero.
- Hero en grid 7/5: columna izquierda 7/12 con eyebrow, H1, subtítulo, párrafo, datos y CTA. Columna derecha 5/12 con **composición tipográfica original** «EL MOMENTO / ANTES DEL SÍ», tres índices apilados `01 DINERO`, `02 TRABAJO`, `03 CLIENTES`, unidos por líneas finas. Esta composición es un recurso visual editorial y NO un formulario ni tres cards.
- El H1 debe tener jerarquía máxima. Tamaño desktop `clamp(68px, 6.6vw, 104px)`, line-height 0.94–0.99, tracking -0.05em. Un renglón natural para «NO EMPRENDAS» y otro para «TODAVÍA.» cuando el ancho lo permita.
- H1 en blanco/papel. El acento signal en una línea corta debajo de TODAVÍA, NO en toda la palabra si el contraste cae.
- Subtitular `clamp(22px,2vw,31px)`, máximo 640px; cuerpo 17–19px, ancho ~600px.
- Fila de fecha distinguible del párrafo: dos fechas como columnas o `MAR 17` / `JUE 19` con rótulo completo accesible, y hora debajo. No inventar iconos de reloj decorativos cuando el texto es suficiente.
- CTA principal claramente visible sin que el visitante haga scroll en viewport desktop de 900px cuando sea factible.

**Composición móvil:**
- Nav compacto con marca y botón de registro accesible, sin romper el ancho.
- Orden: eyebrow → H1 → subtitular → cuerpo → fecha → CTA → microcopy → composición tipográfica secundaria reducida.
- H1 `clamp(45px, 12.2vw, 64px)` line-height 0.97. A 320px debe quedar completo sin letras cortadas.
- La composición tipográfica secundaria no se mostrará por encima del CTA. Evita que el primer CTA quede oculto debajo de una imagen vertical.
- Sin hero fijo de `100vh` que oculte información crítica.

### SECCIÓN 2: identificación

**Fondo:** papel `#F6F3EC`. Eyebrow pequeño a la izquierda, H2 grande a la izquierda y las cuatro situaciones en un listado editorial de dos columnas desktop. Cada situación lleva numeración `01`–`04` con regla horizontal, sin fondos de tarjeta independientes. Móvil: lista de cuatro, una por fila, con padding vertical 16–20px.

**Objetivo:** que la persona diga «esto habla de mi situación» sin leer un bloque de párrafos. No pedir datos ni crear encuesta.

### SECCIÓN 3: demostración del método

**Fondo:** blanco o mist claro. Título a izquierda. Debajo, tres **filas comparativas** de diseño editorial con división vertical: izquierda (frase de venta) en tipografía expresiva y derecha (pregunta crítica) en texto más fuerte, con una línea o indicador que conecta. En mobile, cada fila se apila: etiqueta → frase → pregunta, manteniendo relación visual con borde izquierdo azul. No usar 3 cards idénticas. Remate final en línea grande y breve.

**Impacto:** el visitante obtiene valor antes de registrarse y comprende el método.

### SECCIÓN 4: agenda

**Fondo:** tinta oscuro intercalada para romper monotonía, con encabezados claros. Dos planos editoriales numerados `01` y `02` distribuidos lado a lado en desktop y apilados en móvil. Separarlos con una regla delgada y gran numeración semitransparente, NO cajas bordadas de mismo tamaño. Fecha en signal, títulos blancos; bullets de longitud controlada. CTA debajo.

**Diferenciación:** primer encuentro = comprender los modelos; segundo = aplicar criterios y conocer una alternativa empresarial. No ocultar este segundo propósito.

### SECCIÓN 5: regalo

**Fondo:** papel cálido. Diseño 6/6 desktop: izquierda editorial con 3 beneficios y CTA, derecha una **captura real** del universo o misión de la herramienta, en una composición de dispositivo sobria (sin falsas interfaces). Debe verse como producto útil. En móvil, copia primero y captura real después; controlar peso de la captura y lazy loading si está fuera del viewport.

**No decir que el regalo es un PDF.** Es una herramienta interactiva que permite obtener una misión.

### SECCIÓN 6: equipo + inscripción en tres pasos

**Fondo:** blanco. Fotografía del equipo en banda horizontal grande de relación aproximada 16:9 o 2:1 según recorte real. Integrar la imagen con una máscara sutil y borde editorial; no meterla como cuadrado pequeño aislado. Al lado o debajo, los cuatro nombres alineados como créditos, sin etiquetar rostros por posición. Añadir una breve explicación colectiva; no inventar biografías.

**Después de la foto:** la explicación del proceso en una sola franja horizontal «01 Datos / 02 Envía código / 03 Grupo»; mobile en lista compacta. No crear otra sección de 900px de alto. Es un recordatorio del siguiente paso, no un nuevo embudo.

### SECCIÓN 7: FAQ

**Fondo:** mist `#EAF0FF`. Título y acordeón de 8 preguntas exactas de `01_COPY_APROBADO.md`. Una columna de lectura de ancho máximo 860px, sin iconografía infantil. `details/summary` accesible, foco visible, bordes ligeros, tamaño táctil adecuado.

### SECCIÓN 8: cierre + footer

**Fondo cierre:** tinta `#142238`, H2 claro, acento signal mínimo, CTA azul sobre panel claro o botón blanco sobre fondo oscuro según contraste y jerarquía. Evitar repetir decoraciones del hero. Cierre con gran texto alineado a la izquierda, no un enorme espacio vacío con CTA perdido.

**Footer:** fondo y contenido con contraste AA. Etiquetas legales según copy; no reescribir contenidos jurídicos.

## 3. Registro y confirmación

**Registro:** misma paleta, tipos y CTA. Fondo papel, formulario sobre superficie blanca de máximo 620px. Diseño limpio sin botón marrón o cuadrado. En desktop puede incluir un panel lateral de resumen del evento (fecha/hora/dos sesiones) con texto del COPY; en móvil el resumen arriba, formulario inmediatamente después. No modificar campos ni schema. Labels de 16px mínimo, ayuda 14px legible, mensajes error en español en línea bajo el campo. No depender del popup HTML nativo inglés como único feedback; usar validación accesible y localizar la experiencia.

**Confirmación:** mismo lenguaje visual, pero encabezado «¡YA ESTÁS CASI ADENTRO!» ocupa el foco. Código único muy visible y copiable si función existente; CTA WhatsApp dominante; CTA grupo secundario, claramente separado; bloque del regalo como incentivo. En móvil la persona debe ver título, código y botón de WhatsApp sin desplazarse por contenido superfluo. No activar pasos ni cambiar estado por el solo clic.

**Alineación:** `/`, `/registro` y `/confirmacion` deben sentirse de la misma marca. No crear subpáginas “de plantilla” con otra tipografía o distinto azul.

## 4. Comportamiento por viewport

| Vista | Requisito visual verificable |
|---|---|
| 320px | H1 completo y legible, sin scroll horizontal, CTA íntegro, fecha visible sin recorte |
| 375/390px | CTA del hero anterior a la ilustración secundaria, cards editoriales apiladas, formulario usable con teclado |
| 430px | Espaciado proporcionado; evitar una columna diminuta centrada con mucho margen |
| 768px | Hero refluye sin columnas demasiado estrechas; equipo y regalo mantienen proporciones |
| 1024px | Hero de dos columnas si caben; ningún titular se monta sobre el visual |
| 1440px | Composición editorial amplia, ritmo entre secciones, foto del equipo integrada y cierre fuerte |

## 5. Rendimiento y recursos

- Localizar el recurso LCP real con Lighthouse/Performance: NO asumir que es la imagen del hero.
- Evitar CSS `background-image` pesado como LCP si puede reemplazarse por un recurso optimizado o composición tipográfica.
- Usar `next/image` con tamaños y `sizes` adecuados donde aplique; prioridad alta **solo** para la imagen que realmente sea LCP; lazy para inferiores.
- No precargar `Team.png` si está debajo del hero.
- Evitar bundles adicionales y eliminar CSS/JS no usado solo si no compromete otros componentes.
- Objetivo móvil: LCP de laboratorio ≤2,5 s si técnicamente alcanzable en configuración comparable; documentar métrica real si no se alcanza. Mantener CLS ≤0,1 y rendimiento sin JS innecesario.
- No alterar contenido/servicios de backend para mejorar métrica Lighthouse.

## 6. Regla anti-mediocridad

Cada sección debe aportar una evidencia, una decisión o un motivo para seguir: reconocimiento, pregunta real, agenda, herramienta, personas, logística, FAQ. No añadir logotipos ficticios, porcentajes, contadores, sellos, carruseles, testimonios inventados ni CTAs decorativos. La página debe ser memorable por composición y claridad, no por recargar efectos.

export type FirstWeekMove = { title: string; description: string; expectedLearning: string };
export type DecisionOption = { id: "a" | "b" | "c"; label: string; revelation: string; blindSpot: string; verification: string };
export type DecisionScenario = { situation: string; question: string; options: DecisionOption[]; commonBlindSpot: string };
export type RealityMission = { title: string; hypothesis: string; movements: string[]; conversation: string; record: string[]; evidence: string; notEvidence: string; nextDecision: string };

export type BusinessModel = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  visual: string;
  whatYouSee: string;
  whatYouBuild: string;
  whatYouOffer: string;
  howRevenueWorks: string;
  existingInfrastructure: string[];
  personalResponsibilities: string[];
  skillsToDevelop: string[];
  conditionsToVerify: string[];
  firstWeek: FirstWeekMove[];
  decisiveQuestion: string;
  comparison: { offer: string; builds: string; leverages: string; learns: string; operations: string; risksToVerify: string };
  scenario: DecisionScenario;
  mission: RealityMission;
};

export const BUSINESS_MODELS: BusinessModel[] = [
  {
    id: "traditional", name: "Negocio tradicional", shortName: "Tradicional", tagline: "Construir algo propio, desde la operación.", visual: "amber",
    whatYouSee: "Tu propio local, una marca, una experiencia para clientes y la posibilidad de construir un negocio reconocible.",
    whatYouBuild: "Una operación empresarial: ubicación, abastecimiento, precios, clientes, inventario, servicio, controles y sostenibilidad.",
    whatYouOffer: "Una propuesta concreta y una experiencia que resuelve algo para personas de un mercado específico.",
    howRevenueWorks: "Ingresos por la venta repetida de productos o servicios; la viabilidad depende de demanda, costos y operación real.",
    existingInfrastructure: ["Proveedores y maquinaria", "Software de ventas y pagos", "Servicios especializados"],
    personalResponsibilities: ["Propuesta comercial y experiencia", "Demanda recurrente y control de costos", "Operación diaria y equipo cuando corresponda"],
    skillsToDevelop: ["Lectura del mercado local", "Compras y control operativo", "Servicio y disciplina financiera"],
    conditionsToVerify: ["Demanda en la zona", "Capital de trabajo y costos fijos", "Arriendo, permisos y dependencia del propietario"],
    firstWeek: [
      { title: "Observar una zona", description: "Recorre el mercado y registra hábitos de consumo, horarios y alternativas existentes.", expectedLearning: "Qué comportamiento real merece ser entendido antes de asumir una ubicación." },
      { title: "Comparar la operación", description: "Contrasta proveedores, gastos y necesidades de funcionamiento.", expectedLearning: "Qué partes del modelo exigirían control constante." },
      { title: "Hablar con compradores", description: "Pregunta por necesidades y decisiones de compra sin vender una promesa.", expectedLearning: "Qué señales distinguen interés amable de una necesidad concreta." },
      { title: "Diseñar una validación", description: "Plantea una prueba pequeña antes de comprometerte con costos fijos.", expectedLearning: "Qué dato debería cambiar tu decisión de continuar." },
    ],
    decisiveQuestion: "¿Qué evidencia tienes de que suficientes personas comprarían esta propuesta antes de comprometerte con una operación fija?",
    comparison: { offer: "Producto o servicio y experiencia local", builds: "Operación, demanda y controles", leverages: "Proveedores, equipo y sistemas", learns: "Mercado, costos y servicio", operations: "Presencia física y coordinación diaria", risksToVerify: "Demanda, costos fijos, permisos y arriendo" },
    scenario: { situation: "Has encontrado un local que parece perfecto para una cafetería. La zona tiene movimiento y el propietario te propone reservarlo.", question: "¿Qué harías primero?", commonBlindSpot: "Un local atractivo no demuestra que exista un negocio viable.", options: [
      { id: "a", label: "Negociar el arriendo para no perder la oportunidad.", revelation: "Asegurar una ubicación puede ser útil, pero firmar antes de conocer demanda, costos y obligaciones puede convertir una hipótesis en un compromiso difícil de revertir.", blindSpot: "Estás tratando la urgencia de reservar como si fuera evidencia de compradores.", verification: "Antes de negociar condiciones, observa quién compra en la zona y qué alternativa elegiría hoy." },
      { id: "b", label: "Observar la demanda y hablar con posibles clientes.", revelation: "Permite obtener señales iniciales del mercado sin asumir gastos fijos. El movimiento de personas no demuestra automáticamente intención de compra.", blindSpot: "Las opiniones amables pueden parecer demanda si no preguntas por hábitos y alternativas reales.", verification: "Pregunta dónde compran hoy, qué valoran y qué tendría que cambiar para elegir una cafetería allí." },
      { id: "c", label: "Cotizar equipos y proveedores para calcular la operación.", revelation: "Ayuda a conocer las exigencias operativas, pero todavía falta demostrar que suficientes compradores valorarían la propuesta.", blindSpot: "Un presupuesto detallado puede dar sensación de avance aunque todavía no exista una razón de compra.", verification: "Compara los costos con una propuesta concreta y contrástala con compradores potenciales antes de comprometerte." },
    ] },
    mission: { title: "Antes de firmar, descubre si existe una oportunidad real.", hypothesis: "En esta zona podría existir un grupo de compradores interesado en la propuesta de cafetería que estoy considerando.", movements: ["Observa el entorno comercial en al menos dos franjas horarias relevantes.", "Compara tres alternativas que ya atiendan a compradores similares: oferta, precios visibles y experiencia.", "Conversa con tres consumidores potenciales sobre hábitos de compra y necesidades insatisfechas."], conversation: "Estoy investigando una posible cafetería en esta zona. ¿Dónde compras normalmente café o algo para comer? ¿Qué valoras de ese lugar y qué te gustaría encontrar que hoy no tienes?", record: ["Hábitos concretos", "Alternativas existentes", "Necesidades recurrentes", "Costos y condiciones que siguen sin verificarse"], evidence: "Comportamientos reales, necesidades repetidas y posibilidades de contraste con la oferta existente.", notEvidence: "Que varias personas digan que el local sería bonito.", nextDecision: "Si identificas una necesidad concreta, diseña una prueba de oferta de bajo compromiso antes de considerar un contrato de arriendo." },
  },
  {
    id: "franchise", name: "Franquicia", shortName: "Franquicia", tagline: "Operar bajo un sistema empresarial existente.", visual: "cobalt",
    whatYouSee: "Una marca existente, procesos definidos, productos o servicios establecidos y orientación operativa.",
    whatYouBuild: "Tu propia operación dentro de condiciones contractuales establecidas. No adquieres automáticamente una operación rentable.",
    whatYouOffer: "La ejecución local de una propuesta que ya tiene una identidad y un sistema definidos.",
    howRevenueWorks: "Ingresos por la operación local; el contrato puede incluir inversión, cánones, regalías y obligaciones recurrentes que deben comprobarse.",
    existingInfrastructure: ["Identidad de marca y manuales", "Capacitación y proveedores homologados", "Experiencia operativa del franquiciante"],
    personalResponsibilities: ["Ejecución local y gestión de personas", "Servicio y control financiero", "Cumplimiento contractual"],
    skillsToDevelop: ["Lectura contractual", "Gestión de equipos", "Operación disciplinada bajo estándares"],
    conditionsToVerify: ["Inversión total, canon y regalías", "Duración, territorio y exclusividad", "Soporte incluido y experiencias verificables"],
    firstWeek: [
      { title: "Investigar enseñas", description: "Compara diferentes marcas y sus requisitos de entrada.", expectedLearning: "Qué condiciones son estructurales y cuáles son solo argumentos comerciales." },
      { title: "Solicitar información", description: "Pide documentos contractuales, operativos y financieros disponibles.", expectedLearning: "Qué está documentado y qué permanece como afirmación." },
      { title: "Conversar con franquiciados", description: "Busca experiencias actuales o anteriores y pregunta por la operación real.", expectedLearning: "Qué diferencias existen entre soporte prometido y soporte vivido." },
      { title: "Comparar obligaciones", description: "Ordena inversión, restricciones, soporte y riesgos antes de avanzar.", expectedLearning: "Qué compromiso sería difícil de revertir." },
    ],
    decisiveQuestion: "¿Qué partes del negocio vienen realmente resueltas y cuáles seguirán siendo completamente tu responsabilidad?",
    comparison: { offer: "La propuesta bajo una marca y sistema", builds: "Operación local y cumplimiento", leverages: "Manuales, marca y proveedores", learns: "Contrato, equipo y ejecución", operations: "Estándares definidos y gestión local", risksToVerify: "Inversión, regalías, territorio y soporte" },
    scenario: { situation: "Una franquicia te presenta su marca, sus procesos y una proyección comercial muy interesante.", question: "¿Qué revisarías primero?", commonBlindSpot: "Comprar un sistema no significa que alguien vaya a operar el negocio por ti.", options: [
      { id: "a", label: "La inversión y las regalías.", revelation: "Es indispensable conocer el capital comprometido, pero los números promocionales no sustituyen una evaluación de costos y escenarios reales.", blindSpot: "Puedes concentrarte en la cifra de entrada y dejar fuera obligaciones, duración y salida.", verification: "Pide el costo total, gastos recurrentes y escenarios que expliquen qué queda fuera de la proyección." },
      { id: "b", label: "La operación real de otros franquiciados.", revelation: "Conocer experiencias operativas ayuda a contrastar el discurso comercial, aunque cada ubicación y operador puede tener condiciones diferentes.", blindSpot: "Una experiencia aislada no representa todo el sistema ni reemplaza revisar tu contrato.", verification: "Habla con operadores actuales o anteriores y contrasta sus respuestas con la documentación oficial." },
      { id: "c", label: "El contrato, las obligaciones y el soporte incluido.", revelation: "Permite entender derechos y obligaciones. El soporte prometido debe comprobarse mediante documentos y prácticas verificables.", blindSpot: "Un contrato claro puede seguir dejando en tus manos la operación, el equipo y la demanda local.", verification: "Marca qué soporte está escrito, cómo se entrega y qué responsabilidades seguirían siendo tuyas." },
    ] },
    mission: { title: "Descubre qué estás comprando realmente.", hypothesis: "El sistema empresarial ofrecido podría aportar recursos y procesos que justifiquen sus costos y obligaciones.", movements: ["Solicita condiciones completas de inversión y gastos recurrentes.", "Identifica obligaciones contractuales y alcance verificable del soporte.", "Busca la perspectiva de operadores actuales o anteriores."], conversation: "Estoy evaluando su franquicia. Antes de avanzar quisiera conocer la inversión total estimada, cánones y regalías, obligaciones recurrentes, condiciones de salida y el alcance concreto del acompañamiento. ¿Podrían compartirme la documentación disponible?", record: ["Costos iniciales", "Gastos recurrentes", "Obligaciones", "Soporte incluido", "Restricciones contractuales", "Información pendiente"], evidence: "Documentos y condiciones verificables, contrastados con la operación real cuando sea posible.", notEvidence: "Una presentación de ventas atractiva o una proyección comercial.", nextDecision: "Si la información es completa, contrástala con las obligaciones de operación y asesoría competente antes de comprometer recursos." },
  },
  {
    id: "services", name: "Servicios profesionales", shortName: "Servicios", tagline: "Convertir una capacidad en una solución.", visual: "mint",
    whatYouSee: "Independencia profesional y la posibilidad de monetizar lo que sabes hacer.",
    whatYouBuild: "Una actividad comercial que identifica problemas, consigue clientes, formula propuestas, entrega resultados y mantiene relaciones.",
    whatYouOffer: "Una solución clara a un problema que puedes comprender y resolver con criterio.",
    howRevenueWorks: "Ingresos por proyectos, entregables o acuerdos de servicio; dependen del valor percibido, alcance y capacidad de entrega.",
    existingInfrastructure: ["Experiencia y herramientas digitales", "Redes profesionales", "Software de productividad y contacto"],
    personalResponsibilities: ["Oferta y posicionamiento", "Cartera y proceso comercial", "Capacidad de entrega y confianza"],
    skillsToDevelop: ["Escucha y diagnóstico", "Propuesta de valor", "Venta consultiva y gestión de alcance"],
    conditionsToVerify: ["Necesidad real del mercado", "Tiempo requerido para entregar", "Condiciones de cobro, alcance y dependencia de tu disponibilidad"],
    firstWeek: [
      { title: "Elegir un problema", description: "Delimita una situación concreta que sabes abordar.", expectedLearning: "Si puedes describir el problema sin convertirlo en una lista de habilidades." },
      { title: "Definir una oferta", description: "Escribe qué cambia para el cliente y qué queda fuera del alcance.", expectedLearning: "Qué resultado puede entender y valorar otra persona." },
      { title: "Conversar con clientes", description: "Pregunta por necesidades, alternativas y frustraciones actuales.", expectedLearning: "Qué lenguaje utiliza el mercado para describir el problema." },
      { title: "Diseñar una propuesta", description: "Formula una primera propuesta o prueba de servicio.", expectedLearning: "Qué necesitas demostrar antes de ampliar tu oferta." },
    ],
    decisiveQuestion: "¿Qué problema específico sabes resolver por el que alguien estaría dispuesto a contratarte?",
    comparison: { offer: "Una solución basada en conocimiento o capacidad", builds: "Oferta, confianza y cartera", leverages: "Experiencia, redes y herramientas", learns: "Diagnóstico, alcance y venta", operations: "Entrega por proyectos y relaciones", risksToVerify: "Demanda, disponibilidad y límites del servicio" },
    scenario: { situation: "Tienes una habilidad que podría resolver problemas de otras personas. Quieres convertirla en un servicio remunerado.", question: "¿Por dónde comenzarías?", commonBlindSpot: "Saber hacer algo no significa que el mercado comprenda por qué debería pagarte.", options: [
      { id: "a", label: "Diseñar una marca y una página web.", revelation: "Puede reforzar la presentación profesional, pero una buena identidad no demuestra que exista demanda.", blindSpot: "La apariencia de una oferta puede avanzar mientras el problema del cliente sigue sin definirse.", verification: "Antes de invertir en identidad, identifica a tres posibles compradores y escucha cómo describen el problema." },
      { id: "b", label: "Hablar con personas que podrían tener el problema.", revelation: "Permite conocer necesidades y cómo se resuelven actualmente, aunque el interés verbal no equivale a una compra.", blindSpot: "Puedes confundir una conversación amable con una señal de contratación.", verification: "Después de escuchar, contrasta una oferta específica y un resultado que puedas cumplir." },
      { id: "c", label: "Crear una oferta concreta y compartirla con posibles compradores.", revelation: "Puede obtener señales comerciales más directas, siempre que la oferta sea específica y se pueda cumplir lo prometido.", blindSpot: "Una propuesta concreta puede ser prematura si no entendiste el problema ni delimitaste el alcance.", verification: "Define un alcance pequeño, confirma el problema y comprueba qué parte de la propuesta valora la otra persona." },
    ] },
    mission: { title: "Descubre si tu habilidad resuelve un problema por el que alguien pagaría.", hypothesis: "Existe un segmento de personas o negocios con un problema concreto que mi servicio podría resolver.", movements: ["Expresa la oferta en una frase: ayudo a [tipo de cliente] a resolver [problema] mediante [servicio].", "Conversa con tres posibles compradores sobre cómo resuelven actualmente ese problema.", "Prepara una propuesta de alcance reducido para contrastar interés específico, sin prometer resultados no comprobados."], conversation: "Estoy explorando un servicio para ayudar a [tipo de cliente] a resolver [problema]. Me interesa entender cómo lo manejas hoy, qué es lo más difícil y qué tendría que cambiar para que una solución fuera realmente valiosa.", record: ["Problemas repetidos", "Soluciones actuales", "Costos de mantener el problema", "Requisitos del comprador", "Señales de interés comercial"], evidence: "Necesidades concretas y disposición a evaluar una propuesta específica.", notEvidence: "Que amigos digan que eres muy bueno haciendo tu trabajo.", nextDecision: "Si encuentras un problema recurrente, conviértelo en una oferta piloto delimitada." },
  },
  {
    id: "ecommerce", name: "Comercio electrónico", shortName: "E-commerce", tagline: "Conectar productos con compradores digitales.", visual: "violet",
    whatYouSee: "Una tienda digital, catálogos, pedidos y la posibilidad de llegar a compradores por internet.",
    whatYouBuild: "Un sistema comercial y operativo que atrae demanda, convierte ventas, coordina entregas y resuelve incidencias.",
    whatYouOffer: "Productos presentados y entregados de una manera que resulta relevante frente a alternativas conocidas.",
    howRevenueWorks: "Ingresos por ventas de productos; la estructura real depende de adquisición, costos, inventario, logística y devoluciones.",
    existingInfrastructure: ["Plataformas y marketplaces", "Pasarelas de pago", "Proveedores y operadores logísticos"],
    personalResponsibilities: ["Selección y propuesta de productos", "Adquisición y atención", "Pedidos, cambios y devoluciones"],
    skillsToDevelop: ["Investigación de categoría", "Economía por pedido", "Contenido, conversión y cumplimiento"],
    conditionsToVerify: ["Demanda y competencia", "Costos de adquisición y margen después de gastos", "Inventario, logística y garantías"],
    firstWeek: [
      { title: "Investigar una categoría", description: "Observa compradores, alternativas y preguntas recurrentes.", expectedLearning: "Qué necesidad existe más allá de la apariencia del producto." },
      { title: "Analizar proveedores", description: "Compara abastecimiento, mínimos, tiempos y condiciones.", expectedLearning: "Qué compromisos aparecen antes de vender." },
      { title: "Estimar costos", description: "Construye una estructura de costos sin inventar resultados.", expectedLearning: "Qué variables pueden volver frágil un pedido." },
      { title: "Validar interés", description: "Prueba una oferta y el proceso de cumplimiento a pequeña escala.", expectedLearning: "Qué parte del recorrido necesita mejorar antes de crecer." },
    ],
    decisiveQuestion: "¿Por qué comprarían este producto en tu canal y no en una alternativa que ya conocen?",
    comparison: { offer: "Productos y una experiencia de compra", builds: "Demanda, conversión y cumplimiento", leverages: "Plataformas, pagos y logística", learns: "Categoría, adquisición y devoluciones", operations: "Pedidos, inventario y atención", risksToVerify: "Margen, competencia, logística e inventario" },
    scenario: { situation: "Encuentras un producto atractivo que podrías vender por internet. El proveedor ofrece un precio que parece interesante.", question: "¿Qué harías primero?", commonBlindSpot: "Tener producto y tener una tienda no equivale a tener clientes.", options: [
      { id: "a", label: "Comprar inventario para conseguir mejor precio.", revelation: "Puede mejorar condiciones de compra, pero también aumenta exposición al inventario sin demanda validada.", blindSpot: "El precio del proveedor puede ocultar costos de entrega, devoluciones y adquisición.", verification: "Calcula el costo completo por pedido y busca señales de compradores antes de comprar inventario relevante." },
      { id: "b", label: "Montar la tienda digital.", revelation: "Construye un canal, pero una tienda no genera automáticamente compradores.", blindSpot: "Puedes medir visitas o likes sin saber por qué alguien elegiría tu canal.", verification: "Define una razón diferenciada de compra y contrástala con compradores antes de invertir en el canal." },
      { id: "c", label: "Investigar compradores, competencia y costos completos.", revelation: "Permite entender la economía y la demanda potencial antes de comprometer recursos. Aun así, será necesario obtener señales comerciales reales.", blindSpot: "La investigación puede quedarse en análisis si no la conviertes en una prueba de oferta.", verification: "Habla con compradores, compara alternativas y prueba una oferta pequeña con cumplimiento claro." },
    ] },
    mission: { title: "Antes de comprar inventario, comprueba por qué te comprarían.", hypothesis: "Existe una razón diferenciada para que ciertos compradores adquieran este producto a través de mi canal.", movements: ["Compara productos equivalentes y canales existentes.", "Obtén costos de proveedor, entrega, medios de pago y devoluciones aplicables.", "Habla con posibles compradores sobre criterios de elección, objeciones y alternativas utilizadas."], conversation: "Estoy investigando opciones para ofrecer [tipo de producto]. ¿Dónde lo compras actualmente? ¿Qué comparas antes de decidir y qué te ha generado problemas al comprarlo?", record: ["Alternativas disponibles", "Objeciones", "Condiciones de compra", "Gastos operativos identificables", "Diferenciación posible"], evidence: "Una necesidad concreta junto con una propuesta distinguible y una operación que pueda cumplirse.", notEvidence: "Encontrar un proveedor barato o tener seguidores en redes.", nextDecision: "Si identificas una ventaja verificable, diseña una prueba comercial pequeña antes de comprar inventario relevante." },
  },
  {
    id: "digital", name: "Productos digitales", shortName: "Digital", tagline: "Crear conocimiento o recursos distribuibles.", visual: "coral",
    whatYouSee: "Un activo que puede entregarse digitalmente a múltiples compradores.",
    whatYouBuild: "Un producto útil, una propuesta de valor, un sistema para encontrar compradores, entregarlo y mantener su calidad.",
    whatYouOffer: "Un recurso original que ayuda a resolver una necesidad concreta mejor que una respuesta genérica.",
    howRevenueWorks: "Ingresos por la venta o licencia de un recurso digital; dependen de utilidad, diferenciación y capacidad de encontrar compradores.",
    existingInfrastructure: ["Plataformas de publicación", "Herramientas de creación y cobro", "Distribución digital y experiencia propia"],
    personalResponsibilities: ["Investigar el problema", "Crear y validar calidad", "Oferta, adquisición y soporte cuando aplique"],
    skillsToDevelop: ["Diseño de soluciones", "Escritura y producción", "Validación y distribución"],
    conditionsToVerify: ["Intensidad de la necesidad", "Alternativas gratuitas y disposición a pagar", "Derechos, captación y actualización"],
    firstWeek: [
      { title: "Elegir una necesidad", description: "Delimita una situación que el recurso podría ayudar a resolver.", expectedLearning: "Si el problema es suficientemente específico para crear algo útil." },
      { title: "Investigar alternativas", description: "Compara soluciones existentes, incluyendo las gratuitas.", expectedLearning: "Qué tendría que ser distinto o más claro." },
      { title: "Diseñar un recurso", description: "Boceta una primera versión útil y diferenciable.", expectedLearning: "Qué resultado concreto podría producir." },
      { title: "Validar interés", description: "Busca señales de interés antes de producirlo completo.", expectedLearning: "Qué evidencia merece una siguiente inversión de tiempo." },
    ],
    decisiveQuestion: "¿Qué resultado concreto obtiene alguien al utilizar tu producto que no conseguiría fácilmente con información gratuita?",
    comparison: { offer: "Un recurso digital con utilidad concreta", builds: "Producto, oferta y distribución", leverages: "Herramientas, publicación y conocimiento", learns: "Problema, calidad y adquisición", operations: "Producción, entrega y actualización", risksToVerify: "Necesidad, derechos, diferenciación y captación" },
    scenario: { situation: "Crees que podrías crear una guía digital para resolver un problema que muchas personas tienen.", question: "¿Cómo empezarías?", commonBlindSpot: "Que una información sea útil no significa que sea suficientemente diferenciada para que alguien pague por ella.", options: [
      { id: "a", label: "Escribir el producto completo.", revelation: "Permite desarrollar contenido, pero puede representar mucho trabajo antes de confirmar su utilidad comercial.", blindSpot: "El volumen producido puede ocultar que todavía no sabes para quién es indispensable.", verification: "Delimita el problema y contrasta un recurso mínimo antes de producir la guía completa." },
      { id: "b", label: "Investigar las soluciones gratuitas que ya existen.", revelation: "Muestra qué está disponible y qué podría faltar, aunque identificar un vacío no demuestra disposición a pagar.", blindSpot: "Un hueco en internet no siempre es una necesidad suficientemente intensa.", verification: "Pregunta a personas del público objetivo qué intentaron y qué parte sigue sin resolver." },
      { id: "c", label: "Presentar una propuesta concreta a posibles compradores.", revelation: "Permite contrastar la propuesta con necesidades reales, siempre diferenciando interés educado de intención comercial.", blindSpot: "Una propuesta atractiva puede adelantarse a entender el problema concreto.", verification: "Presenta un recurso mínimo, pregunta por el resultado esperado y busca una señal de compromiso específica." },
    ] },
    mission: { title: "Descubre si vale la pena crear algo antes de producirlo completo.", hypothesis: "Existe una necesidad específica que las alternativas actuales no resuelven suficientemente bien.", movements: ["Identifica un problema preciso y para quién existe.", "Revisa al menos tres alternativas, incluyendo recursos gratuitos.", "Presenta el concepto de un recurso mínimo a tres personas del público objetivo."], conversation: "Estoy investigando una guía práctica sobre [problema específico]. ¿Cómo lo resuelves hoy? ¿Qué parte te sigue generando dudas y qué tendría que incluir un recurso para que realmente te sirviera?", record: ["Problema", "Solución actual", "Información faltante", "Diferencial propuesto", "Señales de uso o compromiso concreto"], evidence: "Problemas específicos, dificultades persistentes y señales de interés hacia una solución definida.", notEvidence: "Que alguien diga «está interesante».", nextDecision: "Construye un prototipo mínimo y comprueba su utilidad antes de invertir en un producto completo." },
  },
  {
    id: "direct", name: "Venta directa", shortName: "Venta directa", tagline: "Desarrollar clientes alrededor de productos.", visual: "gold",
    whatYouSee: "Productos existentes, una compañía, recursos comerciales y una estructura en la que puedes participar sin crear desde cero todo el producto o la infraestructura.",
    whatYouBuild: "Tu propia actividad comercial: conocimiento responsable, clientes, conversaciones, servicio, seguimiento y relaciones sostenibles. Algunos planes incluyen desarrollo de equipo bajo condiciones concretas.",
    whatYouOffer: "Una recomendación responsable y un servicio de seguimiento alrededor de productos que las personas realmente valoran.",
    howRevenueWorks: "Puede incluir margen o comisiones por ventas y, según el plan, componentes relacionados con desarrollo de equipo. Todo depende de condiciones verificables y ventas reales.",
    existingInfrastructure: ["Productos y pedidos de la compañía", "Materiales y capacitación disponible", "Herramientas de seguimiento y acompañamiento"],
    personalResponsibilities: ["Clientes reales y comunicación ética", "Atención y seguimiento", "Constancia, aprendizaje y relaciones de confianza"],
    skillsToDevelop: ["Conocimiento responsable del producto", "Escucha y conversación", "Servicio, límites y seguimiento"],
    conditionsToVerify: ["Costos y compras obligatorias", "Plan de compensación y requisitos", "Ventas a consumidores, publicidad y devoluciones"],
    firstWeek: [
      { title: "Comprender las condiciones", description: "Revisa compañía, productos, costos, políticas y materiales disponibles.", expectedLearning: "Qué sabes y qué todavía depende de una afirmación comercial." },
      { title: "Identificar necesidades", description: "Escucha a posibles consumidores sin convertir la conversación en presión.", expectedLearning: "Si existe una necesidad real y una propuesta de valor clara." },
      { title: "Practicar conversaciones", description: "Ensaya preguntas orientadas a comprender y aportar valor.", expectedLearning: "Qué hace sostenible una relación comercial." },
      { title: "Revisar dudas", description: "Ordena requisitos, costos y condiciones antes de decidir participar.", expectedLearning: "Qué información puede cambiar tu decisión." },
    ],
    decisiveQuestion: "¿Existe una propuesta real de valor para clientes y comprendes exactamente qué tendrás que hacer para desarrollar esa actividad?",
    comparison: { offer: "Productos y acompañamiento comercial", builds: "Clientes, servicio y relaciones", leverages: "Producto, pedidos y materiales", learns: "Conversación, ética y condiciones", operations: "Seguimiento y venta relacional", risksToVerify: "Costos, compras, compensación y ventas reales" },
    scenario: { situation: "Una compañía tiene productos desarrollados, procesos de pedidos y materiales comerciales. Estás considerando construir una actividad alrededor de ellos.", question: "¿Cuál sería tu primer movimiento?", commonBlindSpot: "La infraestructura de una compañía no reemplaza la necesidad de construir clientes reales.", options: [
      { id: "a", label: "Comprar productos para conocerlos y tener inventario.", revelation: "Conocer los productos puede ser valioso, pero las compras personales no demuestran demanda externa ni garantizan ingresos.", blindSpot: "Puedes confundir familiaridad con el producto con evidencia de que consumidores lo elegirán.", verification: "Antes de comprar, identifica qué necesidad atendería el producto y cómo la resuelven hoy los consumidores." },
      { id: "b", label: "Investigar las necesidades de posibles consumidores.", revelation: "Permite investigar si existe una necesidad que los productos puedan atender, sin asumir que cualquier persona será cliente.", blindSpot: "El interés por una necesidad no prueba que la propuesta sea competitiva ni que tú puedas atenderla.", verification: "Pregunta por alternativas actuales, motivos de compra y qué tendría que aportar otra solución." },
      { id: "c", label: "Revisar la compañía, sus condiciones y cómo se obtienen ingresos reales.", revelation: "Aclara obligaciones, costos, políticas y estructura comercial, pero aún necesitas comprender si existe demanda real de consumidores.", blindSpot: "Comprender el plan no sustituye hablar con consumidores ni comprobar ventas reales.", verification: "Contrasta condiciones documentadas con necesidades de consumidores y separa ventas a clientes de cualquier componente de equipo." },
    ] },
    mission: { title: "Descubre si puedes construir clientes reales alrededor de una solución.", hypothesis: "Existe una necesidad legítima de consumidores que los productos de una compañía podrían atender de manera competitiva y responsable.", movements: ["Revisa productos, precio, condiciones, políticas, requisitos y obligaciones.", "Identifica un problema o necesidad de consumidores sin partir de promesas comerciales.", "Habla con tres personas sobre cómo atienden actualmente esa necesidad y qué valoran en una solución."], conversation: "Estoy investigando alternativas para atender [necesidad concreta]. Me gustaría entender cómo la resuelves hoy, qué valoras de lo que utilizas y qué necesitaría ofrecer otra alternativa para que la consideraras.", record: ["Necesidades reales", "Alternativas actuales", "Motivos de compra", "Objeciones", "Condiciones comerciales pendientes", "Requisitos de participación"], evidence: "Demanda potencial identificable, junto con condiciones de producto y comercialización que puedan verificarse.", notEvidence: "Que una persona se entusiasme con la presentación de la oportunidad o que alguien compre inventario para participar.", nextDecision: "Si existe interés de consumidores, comprueba si la propuesta de producto es competitiva y comercialmente sostenible antes de comprometer recursos." },
  },
];

export const MODEL_BY_ID = Object.fromEntries(BUSINESS_MODELS.map((model) => [model.id, model])) as Record<string, BusinessModel>;
export const INTENT_OPTIONS = ["Una segunda fuente de ingresos", "Un proyecto empresarial propio", "Una actividad basada en mis conocimientos", "Una nueva posibilidad que todavía estoy explorando"];

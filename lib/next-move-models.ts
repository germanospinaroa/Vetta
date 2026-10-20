export type FirstWeekMove = { title: string; description: string; expectedLearning: string };

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
  },
];

export const MODEL_BY_ID = Object.fromEntries(BUSINESS_MODELS.map((model) => [model.id, model])) as Record<string, BusinessModel>;
export const INTENT_OPTIONS = ["Una segunda fuente de ingresos", "Un proyecto empresarial propio", "Una actividad basada en mis conocimientos", "Una nueva posibilidad que todavía estoy explorando"];

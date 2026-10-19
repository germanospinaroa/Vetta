export type MatrixPath = "specific" | "comparing" | "exploring";
export type CriterionKey = "investment" | "time" | "risk" | "demand" | "dependence" | "support" | "scale" | "evidence" | "fit" | "economics";

export type MatrixAnswers = {
  path: MatrixPath;
  opportunity: string;
  investmentKnown: "yes" | "no" | "unknown";
  investmentAmount: string;
  currency: string;
  recurringKnown: "yes" | "no" | "unknown";
  essentialFunds: "yes" | "no" | "unknown";
  debt: "yes" | "no" | "unknown";
  availableHours: string;
  requiredHours: "known_fit" | "known_mismatch" | "unknown";
  lossCapacity: "comfortable" | "limited" | "essential" | "unknown";
  demand: "real_customers" | "expressed_interest" | "claims_only" | "unknown";
  dependence: "can_pause" | "depends_on_me" | "unknown";
  support: "documented" | "claimed" | "none" | "unknown";
  scale: "clear" | "unclear" | "unknown";
  evidence: "documents" | "real_customers" | "claims" | "none" | "unknown";
  fit: "strong" | "partial" | "weak" | "unknown";
  economics: "clear" | "partial" | "unknown";
};

export type ExplorationAnswers = {
  path: "exploring";
  time: "low" | "medium" | "high" | "unknown";
  budget: "none" | "limited" | "available" | "unknown";
  risk: "low" | "medium" | "high" | "unknown";
  skills: string;
  interests: string;
  goal: "income" | "flexibility" | "learning" | "growth" | "unknown";
  support: "structured" | "community" | "independent" | "unknown";
};

export type CriterionResult = {
  key: CriterionKey;
  title: string;
  status: "supported" | "validate" | "insufficient" | "alert";
  reason: string;
  nextStep: string;
  question: string;
};

export type DiagnosticResult = {
  kind: "opportunity";
  opportunity: string;
  headline: string;
  coverage: number;
  criteria: CriterionResult[];
  strengths: string[];
  overlooked: string[];
  unknowns: string[];
  nextSteps: string[];
  questions: string[];
  conclusion: string;
};

export type ExplorationResult = {
  kind: "exploration";
  headline: string;
  profile: string[];
  questions: string[];
  nextSteps: string[];
  conclusion: string;
};

export const criterionMeta: Array<{ key: CriterionKey; title: string; prompt: string; help: string }> = [
  { key: "investment", title: "Inversión y costos", prompt: "¿Sabes cuánto dinero necesitarías realmente para empezar?", help: "No solo cuánto cuesta entrar: también materiales, publicidad, cuotas, herramientas y gastos necesarios." },
  { key: "time", title: "Tiempo necesario", prompt: "¿Cuánto tiempo podrías dedicarle y cuánto tiempo exige?", help: "Dos horas libres no significan necesariamente que el negocio pueda funcionar con dos horas." },
  { key: "risk", title: "Riesgo financiero", prompt: "Si no funciona, ¿qué podrías perder?", help: "Considera dinero, deudas, obligaciones pendientes y costos para salir." },
  { key: "demand", title: "Clientes y demanda", prompt: "¿Tienes señales reales de que alguien compraría lo que vas a ofrecer?", help: "Que algo sea popular no demuestra que existan clientes dispuestos a comprártelo a ti." },
  { key: "dependence", title: "Dependencia de tu tiempo", prompt: "¿Qué pasaría si dejaras de trabajar durante una semana?", help: "La respuesta ayuda a entender cuánto depende la operación de tu trabajo diario." },
  { key: "support", title: "Apoyo y herramientas", prompt: "¿Con qué ayuda contarías realmente para comenzar?", help: "Capacitación, procesos, proveedores y atención al cliente deben distinguirse de una promesa." },
  { key: "scale", title: "Capacidad de crecimiento", prompt: "Si quisieras duplicar las ventas, ¿qué tendría que cambiar?", help: "Tal vez necesitarías más horas, personas, dinero o canales." },
  { key: "evidence", title: "Evidencia revisada", prompt: "¿Qué has comprobado personalmente antes de confiar?", help: "Costos, contratos, clientes reales y forma de generar ingresos pesan más que un testimonio aislado." },
  { key: "fit", title: "Encaje personal", prompt: "¿Este negocio encaja con tu vida y con lo que estás dispuesto a hacer?", help: "Incluye actividades, horarios, habilidades, relaciones comerciales y tolerancia al riesgo." },
  { key: "economics", title: "Viabilidad económica", prompt: "¿Sabes de dónde vendrían tus ganancias y cuánto quedaría después de gastos?", help: "Ingresar dinero no es lo mismo que ganar dinero: revisa precios, márgenes y costos." },
];

export function defaultAnswers(path: MatrixPath = "specific"): MatrixAnswers {
  return { path, opportunity: "", investmentKnown: "unknown", investmentAmount: "", currency: "USD", recurringKnown: "unknown", essentialFunds: "unknown", debt: "unknown", availableHours: "", requiredHours: "unknown", lossCapacity: "unknown", demand: "unknown", dependence: "unknown", support: "unknown", scale: "unknown", evidence: "unknown", fit: "unknown", economics: "unknown" };
}

function buildCriterion(key: CriterionKey, status: CriterionResult["status"], reason: string, nextStep: string, question: string): CriterionResult {
  const meta = criterionMeta.find((item) => item.key === key)!;
  return { key, title: meta.title, status, reason, nextStep, question };
}

export function diagnoseOpportunity(input: Partial<MatrixAnswers>): DiagnosticResult {
  const a = { ...defaultAnswers("specific"), ...input };
  const results: CriterionResult[] = [];
  const push = (key: CriterionKey, status: CriterionResult["status"], reason: string, step: string, question: string) => results.push(buildCriterion(key, status, reason, step, question));

  if (a.essentialFunds === "yes" || a.lossCapacity === "essential") push("risk", "alert", "Parte del dinero comprometido parece estar destinado a necesidades esenciales.", "Separa el capital de la oportunidad de tu presupuesto básico y calcula el peor escenario antes de continuar.", "¿Qué ocurre con mis necesidades básicas si no recupero este dinero?");
  else if (a.debt === "yes" && a.lossCapacity === "limited") push("risk", "alert", "La entrada dependería de deuda con poco margen para absorber una pérdida.", "Calcula una cuota máxima que puedas pagar sin depender de ventas futuras.", "¿Qué capacidad de pago tendría si las ventas tardan más de lo esperado?");
  else if (a.debt === "yes" || a.lossCapacity === "limited") push("risk", "validate", "El margen para absorber una pérdida parece limitado o depende de deuda.", "Calcula una cuota máxima que puedas pagar sin depender de ventas futuras.", "¿Qué capacidad de pago tendría si las ventas tardan más de lo esperado?");
  else if (a.lossCapacity === "comfortable") push("risk", "supported", "Has identificado una capacidad de pérdida que no compromete necesidades básicas.", "Documenta el límite que no estás dispuesto a superar.", "¿Qué límite financiero no deberías cruzar?");
  else push("risk", "insufficient", "Todavía no está claro qué podrías perder ni cómo limitarlo.", "Escribe el peor escenario con dinero, deuda y costos de salida.", "¿Cuál es el costo total si decido salir?");

  if (a.investmentKnown === "yes" && a.recurringKnown === "yes") push("investment", "supported", "Conoces la entrada y has revisado los costos que continúan.", "Pide el desglose por escrito y compáralo con tu presupuesto.", "¿Qué pagos debo asumir aunque no consiga ninguna venta?");
  else if (a.investmentKnown === "yes" || a.recurringKnown === "yes") push("investment", "validate", "Hay una parte de los costos identificada, pero falta completar el costo real de sostener la operación.", "Solicita todos los costos iniciales, recurrentes y opcionales en un solo documento.", "¿Qué gastos aparecen durante los primeros tres meses?");
  else push("investment", "insufficient", "No hay información suficiente para estimar cuánto requiere comenzar y sostenerlo.", "Pide un presupuesto completo, incluyendo cuotas, herramientas, publicidad y salida.", "¿Cuál es el costo total antes de conseguir los primeros clientes?");

  if (a.requiredHours === "known_fit" && a.availableHours.trim()) push("time", "supported", "El tiempo disponible y la exigencia conocida parecen compatibles en esta primera revisión.", "Contrasta esa estimación con una semana real de actividades.", "¿Qué tareas son obligatorias cada semana?");
  else if (a.requiredHours === "known_mismatch") push("time", "alert", "La exigencia conocida no parece encajar con el tiempo que puedes dedicar.", "Pide una lista semanal de tareas y decide qué tendría que cambiar para que sea sostenible.", "¿Qué tendría que dejar de hacer para cumplir con este ritmo?");
  else push("time", "insufficient", "Todavía no puedes contrastar las horas disponibles con lo que exige la oportunidad.", "Solicita una lista de actividades semanales y una estimación realista de tiempo.", "¿Cuántas horas dedican personas en una situación parecida a la mía?");

  if (a.demand === "real_customers") push("demand", "supported", "Has señalado clientes o compras reales, no solo una afirmación comercial.", "Verifica que la evidencia corresponda al mercado y al canal que usarías.", "¿Qué clientes compraron algo comparable y por qué?");
  else if (a.demand === "expressed_interest") push("demand", "validate", "Existe interés expresado, pero aún no equivale a una compra.", "Prueba una oferta concreta y registra cuántas personas compran, no solo cuántas opinan.", "¿Qué evidencia muestra que alguien pagaría hoy?");
  else if (a.demand === "claims_only") push("demand", "insufficient", "La demanda está basada principalmente en lo que alguien afirma.", "Pide datos verificables y contrástalos con clientes reales del mercado que te interesa.", "¿Cómo se obtuvieron esas cifras y puedo verificarlas?");
  else push("demand", "insufficient", "Todavía no hay una señal concreta de compra que puedas revisar.", "Habla con posibles clientes y prueba una propuesta concreta antes de comprometer capital.", "¿Qué tendría que observar para saber que existe demanda?");

  if (a.dependence === "can_pause") push("dependence", "supported", "Has identificado una operación que podría resistir una pausa breve o cuenta con soporte.", "Comprueba qué tareas quedan cubiertas cuando no estás disponible.", "¿Qué ocurre si no puedo trabajar durante una semana?");
  else if (a.dependence === "depends_on_me") push("dependence", "validate", "El funcionamiento depende de tu presencia diaria.", "Calcula el costo de delegar las tareas críticas antes de hablar de crecimiento.", "¿Qué parte de la operación se detiene si yo no estoy?");
  else push("dependence", "insufficient", "No está claro cuánto depende la operación de tus horas.", "Describe las tareas que solo tú podrías realizar y las que podrían delegarse.", "¿Qué tareas requieren necesariamente mi tiempo?");

  if (a.support === "documented") push("support", "supported", "Hay apoyo o herramientas que puedes revisar y no solo una promesa verbal.", "Verifica alcance, límites y costo del soporte antes de contar con él.", "¿Qué soporte está incluido y durante cuánto tiempo?");
  else if (a.support === "claimed") push("support", "validate", "El apoyo se ha mencionado, pero todavía falta comprobar qué incluye.", "Pide ejemplos, tiempos de respuesta y condiciones del soporte.", "¿Qué sucede cuando necesito ayuda operativa real?");
  else if (a.support === "none") push("support", "alert", "No has identificado apoyo para una operación que podría requerirlo.", "Define qué funciones tendrías que resolver y cuánto costaría obtener ayuda.", "¿Quién resuelve los problemas cuando yo no sé cómo hacerlo?");
  else push("support", "insufficient", "No está claro con qué personas, procesos o herramientas contarías.", "Solicita una descripción del acompañamiento y de los proveedores indispensables.", "¿Qué recursos necesito desde el primer día?");

  if (a.scale === "clear") push("scale", "supported", "Tienes una hipótesis concreta sobre qué cambiaría al crecer.", "Comprueba el costo y la capacidad de cada paso de crecimiento.", "¿Qué tendría que cambiar para duplicar ventas?");
  else if (a.scale === "unclear") push("scale", "validate", "La idea de crecer existe, pero todavía no está explicada operativamente.", "Describe el siguiente nivel de ventas, horas, personas y capital necesarios.", "¿Qué se vuelve más costoso o complejo cuando crece?");
  else push("scale", "insufficient", "No hay información suficiente para saber cómo crecería la operación.", "Pide un ejemplo concreto de cómo se atiende el doble de demanda.", "¿Qué límite operativo aparecería primero?");

  if (a.evidence === "documents" || a.evidence === "real_customers") push("evidence", "supported", "Has revisado evidencia directa y no solo una presentación.", "Guarda las fuentes y comprueba que sean aplicables a tu caso.", "¿Qué parte de la evidencia puedo verificar por mi cuenta?");
  else if (a.evidence === "claims") push("evidence", "validate", "La evidencia revisada parece depender de afirmaciones que aún necesitan respaldo.", "Pide fuentes, contratos, costos y resultados verificables.", "¿Qué documento o dato respalda esta afirmación?");
  else if (a.evidence === "none") push("evidence", "alert", "Todavía no has comprobado información básica antes de confiar.", "Detén cualquier compromiso y reúne contratos, costos, condiciones y evidencia de clientes.", "¿Qué tendría que ver antes de considerar avanzar?");
  else push("evidence", "insufficient", "Aún no está claro qué información has comprobado personalmente.", "Haz una lista de afirmaciones y marca qué fuente independiente respalda cada una.", "¿Qué información proviene de una fuente que pueda revisar?");

  if (a.fit === "strong") push("fit", "supported", "La actividad parece compatible con tu realidad y disposición actuales.", "Prueba la rutina durante una semana antes de comprometerte.", "¿Qué parte de esta actividad sí quiero sostener en el tiempo?");
  else if (a.fit === "partial") push("fit", "validate", "Hay compatibilidad en algunos aspectos, pero quedan tensiones por resolver.", "Compara las tareas reales con tus horarios, habilidades y límites.", "¿Qué tendría que ajustar para que encaje de verdad?");
  else if (a.fit === "weak") push("fit", "alert", "La oportunidad parece alejarse de tu tiempo, habilidades o disposición actual.", "Identifica el requisito que más te aleja y prueba si puedes resolverlo sin forzarte.", "¿Qué parte no estoy dispuesto a hacer de forma sostenida?");
  else push("fit", "insufficient", "Todavía no sabes si la operación encaja con tu vida.", "Describe un día o semana normal del negocio y compáralo con tu realidad.", "¿Cómo cambiaría mi semana si acepto esta oportunidad?");

  if (a.economics === "clear") push("economics", "supported", "Conoces la relación entre ventas, costos y dinero que quedaría.", "Calcula cuántas ventas necesitas para recuperar la inversión y cubrir costos.", "¿Qué margen queda después de todos los gastos?");
  else if (a.economics === "partial") push("economics", "validate", "Conoces una parte del modelo económico, pero faltan márgenes o costos completos.", "Construye un ejemplo con precio, costo total, margen y ventas necesarias.", "¿Cuántas ventas necesito para cubrir todos mis costos?");
  else push("economics", "insufficient", "No está explicado de dónde vendría la ganancia después de los gastos.", "Pide el modelo de ingresos, costos, márgenes y condiciones de pago.", "¿Cómo se genera el ingreso y cuánto queda realmente?");

  const supported = results.filter((item) => item.status === "supported");
  const alerts = results.filter((item) => item.status === "alert");
  const needs = results.filter((item) => item.status === "validate" || item.status === "insufficient");
  const strengths = supported.slice(0, 3).map((item) => `${item.title}: ${item.reason}`);
  const priority = (item: CriterionResult) => item.key === "risk" || item.key === "economics" ? 0 : item.key === "investment" || item.key === "demand" || item.key === "evidence" ? 1 : 2;
  const orderedNeeds = [...alerts, ...needs].sort((a, b) => priority(a) - priority(b));
  const overlooked = orderedNeeds.slice(0, 3).map((item) => `${item.title}: ${item.reason}`);
  const unknowns = needs.slice().sort((a, b) => priority(a) - priority(b)).slice(0, 4).map((item) => item.reason);
  const nextSteps = orderedNeeds.slice(0, 3).map((item) => item.nextStep);
  const questions = orderedNeeds.slice(0, 5).map((item) => item.question);
  let headline = "Has empezado a mirar la oportunidad con más detalle, pero todavía hay información importante por comprobar.";
  if (alerts.length > 0) headline = "La oportunidad puede tener aspectos interesantes, pero hay señales que conviene aclarar antes de comprometerte.";
  else if (needs.length <= 3) headline = "Tienes una base útil para seguir evaluando, y algunos puntos concretos que vale la pena confirmar.";
  return { kind: "opportunity", opportunity: a.opportunity.trim() || "Tu oportunidad", headline, coverage: supported.length, criteria: results, strengths, overlooked, unknowns, nextSteps, questions, conclusion: alerts.length ? "Hay señales de alerta que justifican detener un compromiso hasta aclararlas." : needs.length ? "Has identificado aspectos relevantes; reúne la información pendiente antes de tomar una decisión." : "Tienes información suficiente para continuar con una evaluación más profunda, sin garantizar un resultado futuro." };
}

export function diagnoseExploration(input: Partial<ExplorationAnswers>): ExplorationResult {
  const a = { path: "exploring" as const, time: "unknown" as const, budget: "unknown" as const, risk: "unknown" as const, skills: "", interests: "", goal: "unknown" as const, support: "unknown" as const, ...input };
  const profile: string[] = [];
  if (a.time === "low") profile.push("Tu búsqueda debería priorizar opciones compatibles con poco tiempo disponible."); else if (a.time === "high") profile.push("Puedes investigar opciones que requieran una dedicación más constante."); else profile.push("Primero necesitas medir con honestidad cuánto tiempo puedes sostener.");
  if (a.budget === "none" || a.budget === "limited") profile.push("Conviene descartar compromisos que dependan de capital que hoy no puedes poner en riesgo."); else profile.push("Aunque tengas capital disponible, conviene separar presupuesto de prueba y necesidades esenciales.");
  if (a.risk === "low") profile.push("Tu búsqueda debería poner el foco en limitar pérdidas y evitar deuda innecesaria."); else profile.push("Antes de escoger, define qué pérdida y qué obligaciones aceptarías realmente.");
  const questions = ["¿Qué problema concreto resuelve esta oportunidad y quién pagaría por él?", "¿Qué tendría que comprobar antes de invertir dinero?", "¿Qué costos aparecen aunque todavía no haya ventas?", "¿Cuánto tiempo exige cada semana?", "¿Qué condiciones de salida o compromisos debo entender?"];
  const nextSteps = ["Elige dos alternativas que encajen con tu tiempo y presupuesto, sin comprometer dinero todavía.", "Pide a cada propuesta sus costos iniciales, recurrentes y condiciones de salida por escrito.", "Habla con posibles clientes o usuarios y separa interés expresado de compras reales."];
  const goal = a.goal === "unknown" ? "una opción que encaje con tu realidad" : a.goal === "income" ? "una fuente adicional de ingresos" : a.goal === "flexibility" ? "más flexibilidad" : a.goal === "learning" ? "aprender una capacidad nueva" : "crecer con una base sostenible";
  return { kind: "exploration", headline: `Tu punto de partida pide buscar ${goal}, no perseguir la primera oportunidad que aparezca.`, profile, questions, nextSteps, conclusion: "Todavía no necesitas elegir un negocio. Necesitas comparar opciones con preguntas que te permitan descubrir cuál merece una investigación más profunda." };
}


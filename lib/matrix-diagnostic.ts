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

export type FindingSeverity = "high" | "medium" | "low";
export type FindingConfidence = "high" | "medium" | "low";
export type FindingKind = "strength" | "alert" | "uncertainty";

export type DiagnosticFinding = {
  id: string;
  kind: FindingKind;
  sourceCriteria: CriterionKey[];
  evidence: string;
  interpretation: string;
  severity: FindingSeverity;
  decisionImpact: string;
  confidence: FindingConfidence;
  recommendedAction: string;
  verificationQuestion: string;
};

export type DiagnosticAction = {
  priority: 1 | 2 | 3;
  title: string;
  why: string;
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
  diagnosisTitle: string;
  synthesis: string;
  findings: DiagnosticFinding[];
  actions: DiagnosticAction[];
  decision: string;
};

export type ExplorationResult = {
  kind: "exploration";
  headline: string;
  profile: string[];
  questions: string[];
  nextSteps: string[];
  conclusion: string;
  diagnosisTitle: string;
  synthesis: string;
  findings: DiagnosticFinding[];
  actions: DiagnosticAction[];
  decision: string;
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

function finding(input: Omit<DiagnosticFinding, "id"> & { id: string }): DiagnosticFinding {
  return input;
}

function orderFindings(items: DiagnosticFinding[]): DiagnosticFinding[] {
  const severity = { high: 0, medium: 1, low: 2 };
  const confidence = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => severity[a.severity] - severity[b.severity] || confidence[a.confidence] - confidence[b.confidence]);
}

function buildOpportunityFindings(a: MatrixAnswers): DiagnosticFinding[] {
  const findings: DiagnosticFinding[] = [];
  const add = (item: Omit<DiagnosticFinding, "id"> & { id: string }) => {
    if (!findings.some((existing) => existing.id === item.id)) findings.push(finding(item));
  };

  if (a.essentialFunds === "yes" || a.lossCapacity === "essential") {
    add({ id: "financial-exposure", kind: "alert", sourceCriteria: ["investment", "risk"], evidence: "Declaraste que usarías dinero necesario para lo básico o que no podrías absorber la pérdida.", interpretation: "La decisión no depende solo de conocer el precio: una pérdida podría afectar necesidades esenciales.", severity: "high", decisionImpact: "Antes de comprometerte necesitas separar el presupuesto básico del capital de prueba.", confidence: "high", recommendedAction: "Define un límite que no afecte tus necesidades básicas y no lo cruces para probar la oportunidad.", verificationQuestion: "¿Qué ocurriría con mis necesidades básicas si no recupero este dinero?" });
  } else if (a.debt === "yes" && (a.lossCapacity === "limited" || a.lossCapacity === "unknown")) {
    add({ id: "debt-limited-margin", kind: "alert", sourceCriteria: ["investment", "risk", "economics"], evidence: "Declaraste que necesitarías deuda y que tu margen para perder dinero es limitado o aún no está calculado.", interpretation: "La deuda puede convertir una oportunidad todavía incierta en una obligación difícil de revertir.", severity: "high", decisionImpact: "Necesitas conocer el costo total y la capacidad de pago sin depender de ventas futuras.", confidence: "high", recommendedAction: "Calcula el peor escenario de pago antes de comprometer deuda.", verificationQuestion: "¿Podría pagar la obligación si las ventas tardan más de lo esperado?" });
  } else if (a.path !== "comparing" && (a.investmentKnown !== "yes" || a.recurringKnown !== "yes")) {
    add({ id: "incomplete-cost-exposure", kind: "uncertainty", sourceCriteria: ["investment", "risk", "economics"], evidence: "Solo parte de los costos iniciales o recurrentes está identificada.", interpretation: "No puedes saber todavía cuánto capital queda expuesto ni qué obligaciones continúan sin ventas.", severity: "medium", decisionImpact: "El costo incompleto puede cambiar la evaluación de compatibilidad financiera.", confidence: "high", recommendedAction: "Reúne en un mismo documento los costos de entrada, continuidad y salida.", verificationQuestion: "¿Qué pagos tendría que asumir durante los primeros meses aunque no venda?" });
  }

  if (a.requiredHours === "known_mismatch" && a.dependence === "depends_on_me") {
    add({ id: "availability-dependence", kind: "alert", sourceCriteria: ["time", "dependence", "fit"], evidence: "Declaraste que la exigencia de tiempo no encaja y que la operación depende mucho de ti.", interpretation: "El problema no es solamente cuánto tiempo tienes: esta oportunidad parece necesitar una disponibilidad que no puedes garantizar.", severity: "high", decisionImpact: "La compatibilidad depende de saber qué actividades son indispensables y cuáles podrían organizarse de otra manera.", confidence: "high", recommendedAction: "Separa las tareas indispensables de las delegables y contrástalas con tu semana real.", verificationQuestion: "¿Qué actividades se detienen si no estoy disponible y quién podría asumirlas?" });
  } else if (a.requiredHours === "known_mismatch") {
    add({ id: "time-mismatch", kind: "alert", sourceCriteria: ["time", "fit"], evidence: "Declaraste que las horas exigidas no encajan con tu disponibilidad.", interpretation: "La operación no parece compatible con el tiempo que puedes sostener hoy.", severity: "high", decisionImpact: "Necesitas resolver el requisito de tiempo antes de evaluar otros beneficios.", confidence: "high", recommendedAction: "Pide una lista semanal de actividades y prueba si el requisito puede reducirse o delegarse.", verificationQuestion: "¿Qué tendría que cambiar para cumplir el ritmo sin forzar mi vida actual?" });
  } else if (a.dependence === "depends_on_me" && a.requiredHours === "unknown") {
    add({ id: "unmeasured-operational-load", kind: "uncertainty", sourceCriteria: ["time", "dependence"], evidence: "Declaraste que la operación depende de ti, pero no conoces la exigencia de tiempo.", interpretation: "La disponibilidad real puede ser el factor decisivo y todavía no está medida.", severity: "medium", decisionImpact: "No es posible afirmar compatibilidad mientras falte una descripción de la carga operativa.", confidence: "high", recommendedAction: "Obtén una semana de actividades reales o descritas y compárala con tu disponibilidad.", verificationQuestion: "¿Cuántas horas y qué tareas son indispensables cada semana?" });
  }

  const favorableConditions = a.investmentKnown === "yes" && a.recurringKnown === "yes" && a.essentialFunds === "no" && a.debt === "no" && a.requiredHours === "known_fit" && a.lossCapacity === "comfortable" && a.demand === "real_customers" && a.dependence === "can_pause" && a.support === "documented" && a.fit === "strong" && a.economics === "clear" && (a.evidence === "documents" || a.evidence === "real_customers");
  if (favorableConditions) {
    add({ id: "compatible-declared-conditions", kind: "strength", sourceCriteria: ["investment", "time", "demand", "dependence", "support", "fit", "economics"], evidence: "Declaraste costos iniciales y recurrentes conocidos, capital separado, tiempo compatible, clientes o compras reales, soporte documentado y un modelo económico claro.", interpretation: "Tus respuestas describen condiciones compatibles para seguir evaluando esta oportunidad sin añadir una alerta artificial.", severity: "low", decisionImpact: "El siguiente paso es comprobar que la documentación y la evidencia declarada aplican realmente a tu mercado y a tu forma de operar.", confidence: "medium", recommendedAction: "Haz una prueba controlada y reversible con el alcance, tiempo y límite financiero que ya declaraste, y registra qué se confirma.", verificationQuestion: "¿Qué evidencia de esta prueba demostraría que las condiciones declaradas se sostienen en mi caso?" });
  }

  if (a.path !== "comparing" && (a.demand === "expressed_interest" || a.demand === "claims_only" || a.demand === "unknown") && (a.economics === "unknown" || a.economics === "partial")) {
    add({ id: "demand-economics-gap", kind: "uncertainty", sourceCriteria: ["demand", "evidence", "economics"], evidence: "La demanda está expresada como interés, afirmaciones o desconocida, y el modelo económico es parcial o desconocido.", interpretation: "Interés declarado no demuestra compras, y aun una compra no demuestra que la operación sea económicamente sostenible.", severity: "high", decisionImpact: "La viabilidad puede cambiar cuando se conecten clientes reales, precio, costos y margen.", confidence: "high", recommendedAction: "Contrasta una oferta concreta con compradores reales y construye un ejemplo completo de margen.", verificationQuestion: "¿Quién pagaría, cuánto quedaría después de todos los costos y cómo puedo comprobarlo?" });
  } else if (a.path !== "comparing" && a.demand === "real_customers" && a.economics === "clear") {
    add({ id: "evidence-with-boundaries", kind: "strength", sourceCriteria: ["demand", "evidence", "economics"], evidence: "Declaraste que existen clientes o compras reales y que entiendes ventas, costos y margen.", interpretation: "Hay una base declarada más concreta para investigar, aunque no constituye garantía de resultados futuros.", severity: "low", decisionImpact: "Puedes concentrarte en comprobar que esos datos sean aplicables a tu canal y condiciones.", confidence: "medium", recommendedAction: "Conserva las fuentes y verifica que correspondan al mercado que realmente operarías.", verificationQuestion: "¿Qué parte de esta evidencia puedo comprobar directamente y trasladar a mi caso?" });
  }

  if (a.dependence === "depends_on_me" && a.support !== "documented") {
    add({ id: "support-dependence", kind: "uncertainty", sourceCriteria: ["dependence", "support", "scale"], evidence: "Declaraste una dependencia alta de tu trabajo y no tienes soporte documentado.", interpretation: "El acompañamiento no puede darse por supuesto: seguirías cargando con las tareas críticas mientras averiguas qué ayuda existe.", severity: "medium", decisionImpact: "La capacidad de sostener y ampliar la operación depende de responsabilidades aún no aclaradas.", confidence: "high", recommendedAction: "Pide el alcance, límites y tiempos del soporte, y lista las tareas que seguirían siendo tuyas.", verificationQuestion: "¿Qué ocurre cuando necesito ayuda operativa real y qué parte debo resolver personalmente?" });
  }

  if (a.fit === "strong" && a.requiredHours === "known_mismatch") {
    add({ id: "fit-time-contradiction", kind: "alert", sourceCriteria: ["time", "fit"], evidence: "Declaraste que encaja contigo, pero también que la exigencia de tiempo no encaja.", interpretation: "Hay una tensión directa entre la percepción general de encaje y el requisito operativo conocido.", severity: "high", decisionImpact: "Necesitas resolver esa contradicción antes de tratar el encaje como fortaleza.", confidence: "high", recommendedAction: "Revisa qué parte de la actividad te parece compatible y cuál impide sostenerla.", verificationQuestion: "¿Qué respuesta cambiaría si separo el interés personal de las horas realmente exigidas?" });
  } else if (a.fit === "weak" && (a.lossCapacity === "limited" || a.debt === "yes")) {
    add({ id: "fit-risk-tension", kind: "alert", sourceCriteria: ["fit", "risk", "time"], evidence: "Declaraste que no encaja con tu realidad y que tendrías poco margen o necesitarías deuda.", interpretation: "La incompatibilidad personal se combina con poco margen para corregirla mediante ensayo o espera.", severity: "high", decisionImpact: "La opción puede exigir un compromiso que no puedes ajustar con facilidad.", confidence: "high", recommendedAction: "Define qué requisito tendría que cambiar sin aumentar deuda ni comprometer necesidades básicas.", verificationQuestion: "¿Qué condición concreta tendría que cambiar para que esto fuera sostenible?" });
  }

  const unknowns = [a.investmentKnown, a.recurringKnown, a.requiredHours, a.lossCapacity, a.demand, a.dependence, a.support, a.evidence, a.economics].filter((value) => value === "unknown").length;
  if (a.path !== "comparing" && unknowns >= 6 && !findings.some((item) => item.kind === "alert")) {
    add({ id: "decision-information-gap", kind: "uncertainty", sourceCriteria: ["investment", "time", "risk", "demand", "evidence", "economics"], evidence: `Marcaste ${unknowns} criterios como desconocidos.`, interpretation: "Todavía no hay una base suficiente para clasificar la oportunidad como compatible o incompatible.", severity: "medium", decisionImpact: "La decisión responsable ahora es organizar la información faltante, no concluir a favor o en contra.", confidence: "high", recommendedAction: "Ordena las comprobaciones por costo potencial, tiempo exigido y evidencia de demanda.", verificationQuestion: "¿Qué dato faltante cambiaría más mi decisión y puedo obtenerlo primero?" });
  }

  if (a.path === "comparing") {
    const missing = [
      a.recurringKnown === "unknown" ? "costos recurrentes" : "",
      a.requiredHours === "unknown" ? "tiempo exigido" : "",
      a.demand === "unknown" ? "demanda" : "",
      a.support === "unknown" ? "soporte" : "",
      a.evidence === "unknown" ? "evidencia" : "",
      a.economics === "unknown" ? "margen" : "",
    ].filter(Boolean);
    add({ id: "comparison-framework", kind: "uncertainty", sourceCriteria: ["investment", "time", "demand", "evidence", "fit", "economics"], evidence: `Elegiste comparar oportunidades y el formulario describe solo la primera. Faltan datos comparables sobre ${missing.length ? missing.join(", ") : "varios criterios"}.`, interpretation: "La incertidumbre es una sola por ahora: no puedes saber qué alternativa encaja mejor hasta aplicar los mismos criterios y separar datos comprobados de afirmaciones.", severity: "medium", decisionImpact: "Una comparación incompleta puede hacer parecer mejor una opción solo porque tiene más información disponible.", confidence: "high", recommendedAction: "Crea una tabla común para cada alternativa, completa primero los criterios faltantes y compáralas sin comprometer dinero.", verificationQuestion: "¿Qué dato debo pedir a todas las alternativas para compararlas en igualdad de condiciones?" });
  }
  return orderFindings(findings);
}

function buildActions(findings: DiagnosticFinding[], path: MatrixPath): DiagnosticAction[] {
  const actionableFindings = findings.filter((item) => item.kind !== "strength");
  const source = actionableFindings.length ? actionableFindings : findings;
  const orderedSource = path === "comparing" ? [...source].sort((a, b) => Number(b.id === "comparison-framework") - Number(a.id === "comparison-framework")) : source;
  return orderedSource.slice(0, 3).map((item, index) => ({ priority: Math.min(index + 1, 3) as 1 | 2 | 3, title: item.recommendedAction, why: item.decisionImpact, question: item.verificationQuestion }));
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
  const findings = buildOpportunityFindings(a);
  const legacyNeeds = results.filter((item) => item.status === "validate" || item.status === "insufficient");
  const legacyAlerts = results.filter((item) => item.status === "alert");
  const legacyPriority = (item: CriterionResult) => item.key === "risk" || item.key === "economics" ? 0 : item.key === "investment" || item.key === "demand" || item.key === "evidence" ? 1 : 2;
  const legacyOrderedNeeds = [...legacyAlerts, ...legacyNeeds].sort((a, b) => legacyPriority(a) - legacyPriority(b));
  const strengths = supported.slice(0, 3).map((item) => `${item.title}: ${item.reason}`);
  const overlooked = legacyOrderedNeeds.slice(0, 3).map((item) => `${item.title}: ${item.reason}`);
  const unknowns = legacyNeeds.slice().sort((a, b) => legacyPriority(a) - legacyPriority(b)).slice(0, 4).map((item) => item.reason);
  const actions = buildActions(findings, a.path);
  const nextSteps = legacyOrderedNeeds.slice(0, 3).map((item) => item.nextStep);
  const questions = legacyOrderedNeeds.slice(0, 5).map((item) => item.question);
  const legacyConclusion = legacyAlerts.length ? "Hay señales de alerta que justifican detener un compromiso hasta aclararlas." : legacyNeeds.length ? "Has identificado aspectos relevantes; reúne la información pendiente antes de tomar una decisión." : "Tienes información suficiente para continuar con una evaluación más profunda, sin garantizar un resultado futuro.";
  const highPriority = findings.some((item) => item.severity === "high" && item.kind === "alert");
  const favorable = findings.some((item) => item.id === "compatible-declared-conditions");
  const comparing = a.path === "comparing";
  const diagnosisTitle = comparing
    ? "Todavía no necesitas elegir: necesitas hacer comparables las alternativas."
    : highPriority
      ? "La tensión principal está entre lo que la oportunidad exige y lo que puedes sostener."
      : favorable
        ? "Tus respuestas describen una base concreta y condiciones compatibles para una validación controlada."
      : findings.some((item) => item.kind === "uncertainty")
        ? "La oportunidad todavía depende de información que puede cambiar tu decisión."
        : "Hay una base concreta para seguir evaluando sin confundir señales con garantías.";
  const synthesis = comparing
    ? "Elegiste comparar oportunidades, pero esta evaluación solo describe la primera que quieres mirar. El siguiente paso no es declarar una ganadora: es aplicar los mismos criterios y separar la evidencia de las afirmaciones en cada alternativa."
    : favorable
      ? "Declaraste costos, tiempo, demanda, soporte y economía compatibles, junto con evidencia que dices haber revisado. Eso permite pasar a una validación limitada; no convierte esas declaraciones en una garantía independiente."
      : highPriority
      ? `${findings.find((item) => item.kind === "alert")?.interpretation || "Hay una incompatibilidad prioritaria."} Antes de comprometerte, resuelve esa tensión con una comprobación concreta.`
      : findings.length
        ? `${findings[0]?.interpretation || "Hay información útil para continuar."} Lo que todavía no está demostrado debe mantenerse como pregunta, no convertirse en una fortaleza.`
        : "Las respuestas no permiten identificar una tensión transversal todavía. Conviene completar la información antes de extraer una conclusión.";
  const conclusion = comparing
    ? "Puedes construir una comparación responsable, pero no afirmar que una alternativa es mejor con esta información. La comprobación que más puede cambiar la evaluación es la que haga comparables costos, tiempo, demanda y margen."
    : favorable
      ? "Puedes avanzar a una validación controlada porque tus respuestas son compatibles en los criterios principales. Sigue distinguiendo la documentación que declaras haber revisado de la evidencia independiente y no trates este diagnóstico como una promesa de rentabilidad."
    : highPriority
      ? "Con la información disponible no conviene asumir un compromiso todavía. La evaluación puede cambiar si se demuestra que la exigencia principal es compatible y que el costo de sostenerla está completo."
      : findings.some((item) => item.kind === "uncertainty")
        ? "Puedes continuar investigando, pero todavía no está demostrado que la oportunidad sea compatible o económicamente sostenible. Prioriza el dato que más reduzca la incertidumbre."
        : "Las respuestas ofrecen una base para continuar, pero no prueban rentabilidad ni garantizan un resultado futuro.";
  return { kind: "opportunity", opportunity: a.opportunity.trim() || "Tu oportunidad", headline: diagnosisTitle, coverage: supported.length, criteria: results, strengths, overlooked, unknowns, nextSteps, questions, conclusion: legacyConclusion, diagnosisTitle, synthesis, findings, actions, decision: conclusion };
}

export function diagnoseExploration(input: Partial<ExplorationAnswers>): ExplorationResult {
  const a = { path: "exploring" as const, time: "unknown" as const, budget: "unknown" as const, risk: "unknown" as const, skills: "", interests: "", goal: "unknown" as const, support: "unknown" as const, ...input };
  const profile: string[] = [];
  if (a.time === "low") profile.push("Tu búsqueda debería priorizar opciones compatibles con poco tiempo disponible."); else if (a.time === "high") profile.push("Puedes investigar opciones que requieran una dedicación más constante."); else profile.push("Primero necesitas medir con honestidad cuánto tiempo puedes sostener.");
  if (a.budget === "none" || a.budget === "limited") profile.push("Conviene descartar compromisos que dependan de capital que hoy no puedes poner en riesgo."); else profile.push("Aunque tengas capital disponible, conviene separar presupuesto de prueba y necesidades esenciales.");
  if (a.risk === "low") profile.push("Tu búsqueda debería poner el foco en limitar pérdidas y evitar deuda innecesaria."); else profile.push("Antes de escoger, define qué pérdida y qué obligaciones aceptarías realmente.");
  const goal = a.goal === "unknown" ? "una opción que encaje con tu realidad" : a.goal === "income" ? "una fuente adicional de ingresos" : a.goal === "flexibility" ? "más flexibilidad" : a.goal === "learning" ? "aprender una capacidad nueva" : "crecer con una base sostenible";
  const findings: DiagnosticFinding[] = [];
  if (a.time === "low" && (a.budget === "none" || a.budget === "limited") && a.risk === "low") findings.push({ id: "exploration-constraints", kind: "uncertainty", sourceCriteria: ["time", "risk", "investment"], evidence: "Declaraste poco tiempo, presupuesto nulo o limitado y baja tolerancia al riesgo.", interpretation: "Tu búsqueda necesita un marco de compromiso pequeño y reversible; todavía no describe una oportunidad concreta ni confirma un riesgo.", severity: "medium", decisionImpact: "Las primeras opciones deben filtrarse por tiempo, costo de prueba y posibilidad de salir sin deuda.", confidence: "high", recommendedAction: "Define un límite de tiempo y presupuesto de exploración antes de revisar propuestas.", verificationQuestion: "¿Qué compromiso máximo puedo asumir sin afectar mis necesidades básicas?" });
  else if (a.time === "low") findings.push({ id: "exploration-time-boundary", kind: "uncertainty", sourceCriteria: ["time", "fit"], evidence: "Declaraste que solo dispones de pocas horas.", interpretation: "El tiempo es un criterio de filtro desde el comienzo, no una limitación que deba confirmarse después de elegir.", severity: "medium", decisionImpact: "Una opción que requiera presencia diaria puede quedar fuera aunque resulte atractiva en otros aspectos.", confidence: "high", recommendedAction: "Descarta primero las propuestas que no describan una dedicación compatible.", verificationQuestion: "¿Qué tareas tendría que realizar cada semana y cuáles son realmente indispensables?" });
  if (a.support === "structured") findings.push({ id: "exploration-structured-support", kind: "strength", sourceCriteria: ["support"], evidence: "Declaraste que una estructura clara te ayudaría a empezar.", interpretation: "Ya tienes una condición concreta para evaluar propuestas: no solo qué prometen, sino cómo acompañan el primer paso.", severity: "low", decisionImpact: "Puedes comparar si cada opción ofrece instrucciones, límites y apoyo verificables.", confidence: "high", recommendedAction: "Pide que cada propuesta describa el apoyo inicial, sus límites y su costo.", verificationQuestion: "¿Qué recibiría exactamente y cómo comprobaría que el apoyo existe?" });
  if (a.goal !== "unknown" && a.interests.trim()) findings.push({ id: "exploration-preferences", kind: "strength", sourceCriteria: ["fit"], evidence: `Declaraste que buscas ${goal} y expresaste intereses concretos.`, interpretation: "Tienes un criterio personal para filtrar alternativas, aunque todavía no demuestra que alguna sea viable.", severity: "low", decisionImpact: "Tus preferencias pueden evitar que compares opciones atractivas pero incompatibles con lo que quieres construir.", confidence: "medium", recommendedAction: "Convierte tus preferencias en criterios observables y úsalo en cada alternativa.", verificationQuestion: "¿Qué tendría que mostrar una opción para demostrar que encaja con este objetivo?" });
  if (a.time === "low" && (a.budget === "none" || a.budget === "limited") && a.goal !== "unknown") findings.push({ id: "exploration-fit-filter", kind: "uncertainty", sourceCriteria: ["time", "investment", "risk", "fit"], evidence: `Declaraste poco tiempo, presupuesto nulo o limitado y que buscas ${goal}${a.interests.trim() ? `, con interés en ${a.interests.trim()}` : ""}.`, interpretation: "Las primeras oportunidades deberían poder probarse con una dedicación acotada, costo de entrada bajo o nulo, salida clara y condiciones que puedas revisar sin endeudarte. Serían incompatibles las que exijan presencia diaria, pagos no reversibles o un compromiso que supere esos límites.", severity: "medium", decisionImpact: "Este filtro permite descartar propuestas incompatibles antes de invertir y comparar las primeras alternativas con las mismas preguntas.", confidence: "high", recommendedAction: "Elige dos alternativas relacionadas con tus intereses y compáralas sin pagar: tiempo semanal, costo de prueba, salida, flexibilidad y apoyo verificable.", verificationQuestion: "¿Cuál de estas alternativas cumple mis límites de tiempo y presupuesto, y qué tendría que demostrar antes de pedir dinero?" });
  if (!findings.some((item) => item.kind === "strength") && a.goal !== "unknown") findings.push({ id: "exploration-goal", kind: "uncertainty", sourceCriteria: ["fit"], evidence: `Declaraste que buscas ${goal}.`, interpretation: "Tu objetivo orienta la búsqueda, pero no permite concluir todavía qué oportunidad lo cumple.", severity: "low", decisionImpact: "Necesitas convertir ese objetivo en preguntas comparables antes de elegir.", confidence: "high", recommendedAction: "Escribe dos señales que una alternativa debería demostrar para acercarte a tu objetivo.", verificationQuestion: "¿Qué evidencia mostraría que esta opción sirve para lo que quiero construir?" });
  const actions = buildActions(findings, "exploring");
  const questions = ["¿Qué problema concreto resuelve esta oportunidad y quién pagaría por él?", "¿Qué tendría que comprobar antes de invertir dinero?", "¿Qué costos aparecen aunque todavía no haya ventas?", "¿Cuánto tiempo exige cada semana?", "¿Qué condiciones de salida o compromisos debo entender?"];
  const nextSteps = ["Elige dos alternativas que encajen con tu tiempo y presupuesto, sin comprometer dinero todavía.", "Pide a cada propuesta sus costos iniciales, recurrentes y condiciones de salida por escrito.", "Habla con posibles clientes o usuarios y separa interés expresado de compras reales."];
  const diagnosisTitle = `Tu búsqueda necesita un filtro para ${goal}, no una oportunidad elegida por inercia.`;
  const synthesis = a.time === "low" && (a.budget === "none" || a.budget === "limited")
    ? "No tener una oportunidad seleccionada no es un riesgo financiero confirmado. Sí tienes límites concretos que deberían definir qué investigas y qué descartas antes de poner dinero o tiempo."
    : `Todavía no necesitas inventar precios, ventas o costos de un negocio. Puedes empezar por convertir ${goal} y tus restricciones en criterios para comparar posibilidades reales.`;
  const conclusion = "Con la información disponible puedes definir el tipo de compromiso que aceptarías, pero no concluir qué oportunidad conviene. La comprobación con mayor capacidad de cambiar la evaluación será la que conecte tus límites con condiciones concretas de una alternativa.";
  return { kind: "exploration", headline: diagnosisTitle, profile, questions, nextSteps, conclusion, diagnosisTitle, synthesis, findings, actions, decision: conclusion };
}


"use client";

import { useEffect, useMemo, useState } from "react";
import { trackClarityEvent } from "@/lib/analytics";
import { criterionMeta, defaultAnswers, diagnoseExploration, diagnoseOpportunity, type CriterionKey, type DiagnosticFinding, type DiagnosticResult, type ExplorationAnswers, type ExplorationResult, type MatrixAnswers, type MatrixPath } from "@/lib/matrix-diagnostic";

const STORAGE_KEY = "no-emprendas-filtro-v2";
type Stage = "start" | "opportunity" | "criterion" | "exploration" | "result";
type SavedState = { answers: MatrixAnswers; exploration: ExplorationAnswers; stage: Stage; criterionIndex: number; explorationIndex: number; result: DiagnosticResult | ExplorationResult | null };

const optionSets: Record<string, Array<{ value: string; label: string }>> = {
  investmentKnown: [{ value: "yes", label: "Sí, tengo un cálculo" }, { value: "no", label: "Solo conozco una parte" }, { value: "unknown", label: "No lo sé todavía" }],
  recurringKnown: [{ value: "yes", label: "Sí, los conozco" }, { value: "no", label: "Conozco algunos" }, { value: "unknown", label: "No lo sé todavía" }],
  essentialFunds: [{ value: "no", label: "No, es capital separado" }, { value: "yes", label: "Sí, lo necesitaría" }, { value: "unknown", label: "No estoy seguro" }],
  debt: [{ value: "no", label: "No usaría deuda" }, { value: "yes", label: "Sí, necesitaría deuda" }, { value: "unknown", label: "Aún no lo sé" }],
  requiredHours: [{ value: "known_fit", label: "Lo sé y encaja" }, { value: "known_mismatch", label: "Lo sé y no encaja" }, { value: "unknown", label: "No lo sé todavía" }],
  lossCapacity: [{ value: "comfortable", label: "Podría asumirlo sin afectar lo básico" }, { value: "limited", label: "Me dejaría con poco margen" }, { value: "essential", label: "Comprometería necesidades básicas" }, { value: "unknown", label: "No lo he calculado" }],
  demand: [{ value: "real_customers", label: "Hay clientes o compras reales" }, { value: "expressed_interest", label: "Hay personas interesadas" }, { value: "claims_only", label: "Solo me han mostrado afirmaciones" }, { value: "unknown", label: "No lo sé todavía" }],
  dependence: [{ value: "can_pause", label: "Podría pausarse o hay soporte" }, { value: "depends_on_me", label: "Depende mucho de mí" }, { value: "unknown", label: "No lo sé todavía" }],
  support: [{ value: "documented", label: "Está descrito y puedo comprobarlo" }, { value: "claimed", label: "Lo han prometido, pero no lo he comprobado" }, { value: "none", label: "No tendría apoyo claro" }, { value: "unknown", label: "No lo sé todavía" }],
  scale: [{ value: "clear", label: "Tengo un plan concreto" }, { value: "unclear", label: "Tengo una idea, no un plan" }, { value: "unknown", label: "No lo sé todavía" }],
  evidence: [{ value: "documents", label: "He revisado documentos o fuentes" }, { value: "real_customers", label: "He hablado con clientes reales" }, { value: "claims", label: "He visto testimonios o afirmaciones" }, { value: "none", label: "Todavía no he comprobado nada" }, { value: "unknown", label: "No lo sé todavía" }],
  fit: [{ value: "strong", label: "Sí, encaja bastante" }, { value: "partial", label: "En parte" }, { value: "weak", label: "No encaja con mi realidad" }, { value: "unknown", label: "No lo sé todavía" }],
  economics: [{ value: "clear", label: "Sí, entiendo ventas, costos y margen" }, { value: "partial", label: "Entiendo una parte" }, { value: "unknown", label: "No lo sé todavía" }],
};

const criterionKeys: CriterionKey[] = ["investment", "time", "risk", "demand", "dependence", "support", "scale", "evidence", "fit", "economics"];

function freshState(): SavedState {
  return { answers: defaultAnswers(), exploration: { path: "exploring", time: "unknown", budget: "unknown", risk: "unknown", skills: "", interests: "", goal: "unknown", support: "unknown" }, stage: "start", criterionIndex: 0, explorationIndex: 0, result: null };
}
function readSaved(): SavedState | null {
  try { const raw = window.localStorage.getItem(STORAGE_KEY); if (!raw) return null; const parsed = JSON.parse(raw) as SavedState; return parsed?.answers && parsed?.stage ? parsed : null; } catch { return null; }
}

function resultText(result: DiagnosticResult | ExplorationResult) {
  const strengths = result.findings.filter((item) => item.kind === "strength").slice(0, 2);
  const priorities = result.findings.filter((item) => item.kind !== "strength").slice(0, 3);
  const lines = ["EL FILTRO ANTES DEL SÍ", result.kind === "opportunity" ? `Oportunidad: ${result.opportunity}` : "Exploración", "", "TU DIAGNÓSTICO", result.diagnosisTitle, result.synthesis];
  if (strengths.length) lines.push("", "FORTALEZAS", ...strengths.map((item) => `${item.interpretation} Evidencia: ${item.evidence}`));
  if (priorities.length) lines.push("", "LO QUE REALMENTE IMPORTA", ...priorities.map((item) => `${item.interpretation} Evidencia: ${item.evidence}`));
  if (result.actions.length) lines.push("", "QUÉ HARÍA AHORA", ...result.actions.flatMap((item) => [`${item.priority}. ${item.title}`, `Pregunta: ${item.question}`]));
  lines.push("", "ANTES DE TOMAR TU DECISIÓN", result.decision);
  if (result.kind === "opportunity") lines.push("", `Cobertura secundaria: ${result.coverage}/10 criterios. No mide rentabilidad ni probabilidad de éxito.`);
  return lines.join("\n");
}

export function MatrixTool() {
  const [state, setState] = useState<SavedState>(freshState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const saved = readSaved(); window.setTimeout(() => { if (saved) setState(saved); setHydrated(true); }, 0); }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state, hydrated]);

  const currentCriterion = criterionKeys[state.criterionIndex];
  const currentMeta = criterionMeta.find((item) => item.key === currentCriterion);
  const explorationPrompts = [
    { key: "time", title: "¿Cuánto tiempo podrías dedicarle por semana?", options: [{ value: "low", label: "Pocas horas" }, { value: "medium", label: "Unas horas constantes" }, { value: "high", label: "Una dedicación amplia" }, { value: "unknown", label: "No lo sé todavía" }] },
    { key: "budget", title: "¿Qué presupuesto podrías poner a prueba sin comprometer lo básico?", options: [{ value: "none", label: "Ninguno por ahora" }, { value: "limited", label: "Un presupuesto limitado" }, { value: "available", label: "Tengo capital separado" }, { value: "unknown", label: "No lo sé todavía" }] },
    { key: "risk", title: "¿Qué nivel de riesgo estás dispuesto a considerar?", options: [{ value: "low", label: "Quiero limitarlo mucho" }, { value: "medium", label: "Puedo evaluar un riesgo moderado" }, { value: "high", label: "Estoy dispuesto a asumir más" }, { value: "unknown", label: "No lo sé todavía" }] },
    { key: "goal", title: "¿Qué te gustaría construir primero?", options: [{ value: "income", label: "Ingresos adicionales" }, { value: "flexibility", label: "Más flexibilidad" }, { value: "learning", label: "Aprender una capacidad" }, { value: "growth", label: "Crecer con una base sostenible" }, { value: "unknown", label: "Todavía no lo tengo claro" }] },
    { key: "support", title: "¿Qué tipo de apoyo te ayudaría a empezar?", options: [{ value: "structured", label: "Una estructura clara" }, { value: "community", label: "Una comunidad" }, { value: "independent", label: "Avanzar por mi cuenta" }, { value: "unknown", label: "No lo sé todavía" }] },
  ] as const;

  function reset() { setState(freshState()); window.localStorage.removeItem(STORAGE_KEY); }
  function choosePath(path: MatrixPath) { setState((current) => ({ ...current, answers: { ...current.answers, path }, stage: path === "exploring" ? "exploration" : "opportunity", criterionIndex: 0 })); }
  function setAnswer(key: string, value: string) { setState((current) => ({ ...current, answers: { ...current.answers, [key]: value } })); }
  function goNextCriterion() { setState((current) => { if (current.criterionIndex >= criterionKeys.length - 1) { trackClarityEvent("matrix_completed"); return { ...current, stage: "result", result: diagnoseOpportunity(current.answers) }; } return { ...current, criterionIndex: current.criterionIndex + 1 }; }); }
  function goBackCriterion() { setState((current) => current.criterionIndex === 0 ? { ...current, stage: "opportunity" } : { ...current, criterionIndex: current.criterionIndex - 1 }); }
  function goNextExploration() { setState((current) => { if (current.explorationIndex >= explorationPrompts.length - 1) { trackClarityEvent("matrix_completed"); return { ...current, stage: "result", result: diagnoseExploration(current.exploration) }; } return { ...current, explorationIndex: current.explorationIndex + 1 }; }); }
  function download() { if (!state.result) return; const blob = new Blob([resultText(state.result)], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "el-filtro-antes-del-si.txt"; anchor.click(); URL.revokeObjectURL(url); }

  const result = state.result;
  const progress = state.stage === "criterion" ? `${state.criterionIndex + 1} de 10` : state.stage === "exploration" ? `${state.explorationIndex + 1} de 5` : null;
  const savedMessage = useMemo(() => hydrated && state.stage !== "start" ? "Tus respuestas se guardan solo en este dispositivo." : "", [hydrated, state.stage]);
  const criterionAnswerKey = currentCriterion === "investment" ? "investmentKnown" : currentCriterion === "time" ? "requiredHours" : currentCriterion;

  return <div className="filter-v2" data-clarity-mask="true" aria-live="polite">
    {state.stage !== "start" && state.stage !== "result" && <div className="filter-v2-progress"><span>{progress ? `Pregunta ${progress}` : "Tu evaluación"}</span><span>{savedMessage}</span></div>}
    {state.stage === "start" && <section className="filter-v2-intro"><div className="filter-v2-orb" aria-hidden="true" /><h2>¿Es una oportunidad para ti o solo suena demasiado bien?</h2><p>Responde unas preguntas sencillas y descubre qué juega a tu favor, qué podrías estar pasando por alto y qué necesitas comprobar antes de tomar una decisión.</p><button className="button button-dark filter-v2-primary" type="button" onClick={() => { trackClarityEvent("matrix_started"); setState((current) => ({ ...current, stage: "opportunity" })); }}>ANALIZAR MI OPORTUNIDAD <span aria-hidden="true">→</span></button><p className="filter-v2-note">No se envían tus respuestas. Puedes guardar el avance y borrarlo cuando quieras.</p></section>}
    {state.stage === "opportunity" && <section className="filter-v2-question"><p className="filter-v2-kicker">Para empezar</p><h2>¿Ya tienes una oportunidad de negocio que te gustaría evaluar?</h2><div className="filter-v2-options"><button type="button" onClick={() => choosePath("specific")}>Sí, tengo una oportunidad específica<span>Quiero analizar una propuesta concreta.</span></button><button type="button" onClick={() => choosePath("comparing")}>Estoy comparando varias<span>Empezaré por la que más me interesa.</span></button><button type="button" onClick={() => choosePath("exploring")}>Todavía estoy explorando<span>Quiero definir qué debo buscar.</span></button></div></section>}
    {state.stage === "opportunity" && (state.answers.path === "specific" || state.answers.path === "comparing") && <section className="filter-v2-question filter-v2-inline-question"><label htmlFor="matrix-opportunity">{state.answers.path === "specific" ? "¿Qué oportunidad quieres mirar?" : "¿Cuál quieres analizar primero?"}</label><p>{state.answers.path === "specific" ? "Puede ser una franquicia, una tienda online, una consultoría o una idea propia." : "Empezaremos por la que más te interesa; luego podrás guardar otra evaluación por separado."}</p><input id="matrix-opportunity" value={state.answers.opportunity} onChange={(e) => setAnswer("opportunity", e.target.value)} placeholder="Escribe el nombre o tipo de oportunidad" /><button className="button button-dark" type="button" disabled={!state.answers.opportunity.trim()} onClick={() => setState((current) => ({ ...current, stage: "criterion" }))}>CONTINUAR <span aria-hidden="true">→</span></button></section>}
    {state.stage === "criterion" && currentMeta && <section className="filter-v2-question"><p className="filter-v2-kicker">{currentMeta.title}</p><h2>{currentMeta.prompt}</h2><p className="filter-v2-help">{currentMeta.help}</p>{currentCriterion === "investment" && <div className="filter-v2-extra"><label htmlFor="matrix-amount">¿Tienes una cantidad estimada?</label><div className="filter-v2-number"><input id="matrix-amount" inputMode="decimal" value={state.answers.investmentAmount} onChange={(e) => setAnswer("investmentAmount", e.target.value)} placeholder="Cantidad, si la conoces" /><input aria-label="Moneda" value={state.answers.currency} onChange={(e) => setAnswer("currency", e.target.value.toUpperCase().slice(0, 4))} placeholder="USD" /></div></div>}{currentCriterion === "time" && <div className="filter-v2-extra"><label htmlFor="matrix-hours">¿Cuántas horas podrías dedicar?</label><input id="matrix-hours" inputMode="decimal" value={state.answers.availableHours} onChange={(e) => setAnswer("availableHours", e.target.value)} placeholder="Ej. 2 horas al día" /></div>}<div className="filter-v2-options">{(optionSets[criterionAnswerKey] || []).map((option) => <button key={option.value} className={String(state.answers[criterionAnswerKey as keyof MatrixAnswers]) === option.value ? "selected" : ""} type="button" onClick={() => setAnswer(criterionAnswerKey, option.value)}>{option.label}</button>)}</div><div className="filter-v2-nav"><button className="text-button" type="button" onClick={goBackCriterion}>← Atrás</button><button className="button button-dark" type="button" onClick={goNextCriterion}>CONTINUAR <span aria-hidden="true">→</span></button></div></section>}
    {state.stage === "exploration" && <section className="filter-v2-question"><p className="filter-v2-kicker">Tu punto de partida</p><h2>{explorationPrompts[state.explorationIndex].title}</h2><div className="filter-v2-options">{explorationPrompts[state.explorationIndex].options.map((option) => <button key={option.value} className={String(state.exploration[explorationPrompts[state.explorationIndex].key]) === option.value ? "selected" : ""} type="button" onClick={() => setState((current) => ({ ...current, exploration: { ...current.exploration, [explorationPrompts[current.explorationIndex].key]: option.value } }))}>{option.label}</button>)}</div><div className="filter-v2-nav"><button className="text-button" type="button" onClick={() => setState((current) => current.explorationIndex === 0 ? { ...current, stage: "opportunity" } : { ...current, explorationIndex: current.explorationIndex - 1 })}>← Atrás</button><button className="button button-dark" type="button" onClick={goNextExploration}>CONTINUAR <span aria-hidden="true">→</span></button></div></section>}
    {state.stage === "result" && result && <ResultView result={result} download={download} onReview={() => setState((current) => ({ ...current, stage: current.answers.path === "exploring" ? "exploration" : "criterion", result: null }))} onReset={reset} />}
  </div>;
}

function ResultView({ result, download, onReview, onReset }: { result: DiagnosticResult | ExplorationResult; download: () => void; onReview: () => void; onReset: () => void }) {
  const strengths = result.findings.filter((item) => item.kind === "strength").slice(0, 2);
  const priorities = result.findings.filter((item) => item.kind !== "strength").slice(0, 3);
  const principal = priorities[0] || strengths[0];
  return <section className="filter-v3-results" aria-label="Diagnóstico V3">
    <section className="filter-v3-block filter-v3-diagnosis"><p className="filter-v2-kicker">A · Tu diagnóstico</p><h2>{result.diagnosisTitle}</h2><p className="filter-v3-synthesis">{result.synthesis}</p>{principal && <div className="filter-v3-principal"><span>Principal hallazgo</span><strong>{principal.interpretation}</strong><small>{principal.evidence}</small></div>}{result.kind === "opportunity" && <p className="filter-v2-coverage">Cobertura secundaria: <strong>{result.coverage}/10</strong><span>No mide rentabilidad ni probabilidad de éxito.</span></p>}</section>
    <section className="filter-v3-block"><p className="filter-v2-kicker">B · Lo que realmente importa</p>{strengths.length > 0 && <div className="filter-v3-group"><h3>Fortalezas sustentadas</h3>{strengths.map((item) => <FindingItem key={item.id} item={item} tone="positive" />)}</div>}{priorities.length > 0 && <div className="filter-v3-group"><h3>Alertas e incertidumbres prioritarias</h3>{priorities.map((item) => <FindingItem key={item.id} item={item} tone="attention" />)}</div>}</section>
    {result.actions.length > 0 && <section className="filter-v3-block"><p className="filter-v2-kicker">C · Qué haría ahora</p><div className="filter-v3-actions">{result.actions.map((item) => <article key={`${item.priority}-${item.title}`}><span className="filter-v3-action-number">{item.priority}</span><div><h3>{item.title}</h3><p>{item.why}</p><p className="filter-v3-question"><strong>Pregunta:</strong> {item.question}</p></div></article>)}</div></section>}
    <section className="filter-v3-block filter-v3-decision"><p className="filter-v2-kicker">D · Antes de tomar tu decisión</p><p>{result.decision}</p></section>
    <div className="filter-v2-result-actions"><button className="button button-dark" type="button" onClick={download}>DESCARGAR MI ANÁLISIS</button><button className="button button-outline" type="button" onClick={() => window.print()}>IMPRIMIR</button><button className="text-button" type="button" onClick={onReview}>REVISAR RESPUESTAS</button><button className="text-button" type="button" onClick={onReset}>BORRAR Y EMPEZAR DE NUEVO</button></div>
  </section>;
}

function FindingItem({ item, tone }: { item: DiagnosticFinding; tone: "positive" | "attention" }) {
  return <article className={`filter-v3-finding is-${tone}`}><h4>{item.interpretation}</h4><p>{item.decisionImpact}</p><small>{item.evidence}</small></article>;
}
